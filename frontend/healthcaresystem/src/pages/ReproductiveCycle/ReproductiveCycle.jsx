import React, { useEffect, useState } from "react";
import AuthModal from '../../components/Header/AuthModal/AuthModal';
import Cookies from 'js-cookie';
import {
  Calendar,
  Button,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  message,
  Row,
  Col,
  Table,
} from "antd";
import dayjs from "dayjs";
import moment from "moment";
import api from "../../services/api";
import "./ReproductiveCycle.css";
import MainLayout from "../../components/Layout/Layout";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faRotateLeft,
  faEgg,
  faHeartCircleBolt,
  faTriangleExclamation,
  faChartLine,
  faCalendarDays,
  faDroplet
} from '@fortawesome/free-solid-svg-icons'

function ReproductiveCycle() {
  const [cycles, setCycles] = useState([]);
  const [markedDays, setMarkedDays] = useState(new Map());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [defaultTab, setDefaultTab] = useState(0);
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false);
  const [form] = Form.useForm();

  const memberId = Cookies.get('userId'); //Cookies.get('userId')

  const handleOpenModal = () => {
      if (!memberId) {
        setDefaultTab(0);
        setAuthModalOpen(true);
        return;
      }
      setIsModalVisible(true);
  };

  useEffect(() => {
    fetchCycles();
  }, [memberId]);

  useEffect(() => {
    if (cycles.length > 0) {
      // Cập nhật lịch đánh dấu
      setMarkedDays(getMarkedDays(cycles));

      // Nếu modal đang mở → gán predictedCycle vào form
      if (isModalVisible) {
        const predicted = getPredictedCycle(cycles);
        if (predicted) {  
          form.setFieldsValue({
            startDate: dayjs(predicted.startDate),
            cycleLength: predicted.cycleLength,
            periodLength: predicted.periodLength,
          });
        }
      }
    }
  }, [cycles, isModalVisible]);

  const fetchCycles = async () => { 
    if (!memberId) {
      message.warning("Vui lòng đăng nhập để theo dõi chu kỳ.");
      setCycles([]);
      return;
    }

    try {
      const res = await api.get(`/cycle/${memberId}`);
      const data = res.data || [];

      if (data.length === 0) {
        message.info("Bạn chưa khai báo chu kỳ nào. Hãy nhấn 'Khai báo chu kỳ' để bắt đầu.");
      }

      setCycles(data);
    } catch (err) {
      if (err.response?.status === 404) {
        message.info("Bạn chưa khai báo bất kỳ chu kỳ nào");
        setCycles([]);
      } else {
        message.error("Không thể tải dữ liệu chu kỳ");
      }
    }
  };

  const getPredictedCycle = (cycles) => {
    if (!cycles || cycles.length === 0) return null;

    const sortedCycles = [...cycles].sort((a, b) =>
      moment(a.startDate).diff(moment(b.startDate))
    );

    const last = sortedCycles[sortedCycles.length - 1];

    const nextStart = moment(last.startDate).clone().add(last.cycleLength + 1, "day");
    const nextEnd = nextStart.clone().add(last.periodLength - 1, "day");

    return {
      startDate: nextStart,
      endDate: nextEnd,
      cycleLength: last.cycleLength,
      periodLength: last.periodLength,
    };
  };

  const getMarkedDays = (cycles) => {
    const map = new Map();

    const markRange = (start, end, type, text) => {
      let current = moment(start);
      const last = moment(end);
      while (current.isSameOrBefore(last)) {
        map.set(current.format("YYYY-MM-DD"), { type, text });
        current = current.clone().add(1, "day");
      }
    };

    // Đánh dấu các chu kỳ thật
    cycles.forEach((cycle) => {
      const { startDate, ovulationDate, periodLength, fertileStart, fertileEnd } = cycle;

      if (startDate && periodLength) {
        const menstruationStart = moment(startDate);
        const menstruationEnd = menstruationStart.clone().add(periodLength - 1, "day");
        markRange(menstruationStart, menstruationEnd, "menstruation", "Kỳ kinh");
      }

      if (fertileStart && fertileEnd) {
        markRange(fertileStart, fertileEnd, "fertile", "Thụ thai");
      }

      if (ovulationDate) {
        map.set(moment(ovulationDate).format("YYYY-MM-DD"), {
          type: "ovulation",
          text: "Rụng trứng",
        });
      }
    });

    // Dự đoán chu kỳ tiếp theo
    const predictedCycle = getPredictedCycle(cycles);
    if (predictedCycle) {
      markRange(predictedCycle.startDate, predictedCycle.endDate, "predicted-menstruation", "Dự đoán kinh");
      // markRange(predictedCycle.fertileStart, predictedCycle.fertileEnd, "predicted-fertile", "Dự đoán thụ thai");
      // map.set(predictedCycle.ovulationDate.format("YYYY-MM-DD"), {
      //   type: "predicted-ovulation",
      //   text: "Dự đoán rụng trứng",
      // });
    }

    return map;
  };

  const cellRender = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const info = markedDays.get(dateStr);

    return (
      <div className={`cycle-cell-wrapper ${info?.type || ""}`}>
        <div className="date-number">{value.date()}</div>
      </div>
    );
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const startDate = values.startDate;
      const cycleLength = values.cycleLength;

      //Kiểm tra trùng startDate
      const isDuplicate = cycles.some(c => {
        const dbStart = moment(c.startDate).format("YYYY-MM-DD");
        const inputStart = startDate.format("YYYY-MM-DD");
        return dbStart === inputStart;
      });

      console.log("Cycles trong handleOk:", cycles);
      console.log("StartDate đang nhập:", startDate.format("YYYY-MM-DD"));

      if (isDuplicate) {
        message.warning("Chu kỳ với ngày bắt đầu này đã tồn tại!");
        return;
      }

      const endDate = startDate.clone().add(cycleLength, "day");
      const payload = {
        memberId,
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
        cycleLength: cycleLength,
        periodLength: values.periodLength,
        pillTime: values.pillTime ? values.pillTime.format("HH:mm:ss") : null,
      };
      await api.post("/cycle/add", payload);
      message.success("Khai báo thành công!");
      setIsModalVisible(false);
      form.resetFields();
      fetchCycles();
    } catch (err) {
      message.error("Vui lòng nhập đầy đủ thông tin");
    }
  };

  const columns = [
    { title: "Bắt đầu", dataIndex: "startDate" },
    { title: "Kết thúc", dataIndex: "endDate" },
    { title: "Rụng trứng", dataIndex: "ovulationDate" },
    { title: "Độ dài chu kỳ", dataIndex: "cycleLength" },
    { title: "Số ngày hành kinh", dataIndex: "periodLength" },
  ];

  return (
    <MainLayout>
      <div className="reproductive-cycle-container">
        <h2 className="title">Theo dõi chu kỳ sinh sản</h2>
        <div className="header1">
          <div className="left">
            <div className="icon-wrapper">
              <FontAwesomeIcon icon={faDroplet} style={{ color: '#d03501' }} />
            </div>
            <h3 className="titlejr">Chu Kỳ Của Tôi</h3>
          </div>
          <Button type="primary" onClick={handleOpenModal}>
            + Khai Báo Chu Kỳ
          </Button>
        </div>
        <Row gutter={[16, 16]}>
          <Col span={16}>
            <div className="calendar-section">
              <Calendar 
                cellRender={cellRender} 
                fullscreen={false} 
                className="cycle-calendar" 
                headerRender={({ value, onChange }) => {
                  const current = value.clone();
                  const year = current.year();
                  const month = current.month();
                  const years = [];
                  for (let i = year - 10; i <= year + 10; i++) {
                    years.push(i);
                  }
                  const months = moment.monthsShort();

                  return (
                    <div className="calendar-title-bar">
                      <div className="calendar-header">
                        <span role="img"><FontAwesomeIcon icon={faCalendarDays} size="lg" style={{color: "#DB2777",}} /></span>  Lịch chu kỳ tháng {dayjs().format("MM/YYYY")}
                      </div>

                      <div className="calendar-header-wrapper">
                        <select
                          className="calendar-select"
                          value={year}
                          onChange={(e) => {
                            const newYear = parseInt(e.target.value, 10);
                            onChange(current.clone().year(newYear));
                          }}
                        >
                          {years.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>

                        <select
                          className="calendar-select"
                          value={month}
                          onChange={(e) => {
                            const newMonth = parseInt(e.target.value, 10);
                            onChange(current.clone().month(newMonth));
                          }}
                        >
                          {months.map((m, idx) => (
                            <option key={idx} value={idx}>
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  );
                }}
              />
              <div className="legend">
                <span className="legend-item">
                  <span className="dot menstruation" /> Kỳ kinh
                </span>
                <span className="legend-item">
                  <span className="dot ovulation" /> Rụng trứng
                </span>
                <span className="legend-item">
                  <span className="dot fertile" /> Thụ thai
                </span>
                <span className="legend-item">
                  <span className="dot predicted" /> Dự đoán
                </span>
              </div>
            </div>
          </Col>

          <Col span={8}>
            <div className="prediction-card">
              <div className="prediction-card-header">
                <span role="img"><FontAwesomeIcon icon={faChartLine} size="lg" style={{color: "#54AA7F",}} /></span>  Dự đoán & Phân tích
              </div>
              {cycles.length > 0 ? (
                (() => {
                  const predicted = getPredictedCycle(cycles);
                  const { startDate, endDate } = predicted;
                  const ovulation = startDate.clone().subtract(14, "day");
                  console.log("predicted", predicted);
                  console.log("ovulation", ovulation);

                  return (
                    <ul className="prediction-list">
                      <li className="prediction-item">
                        <div className="icon-wrapper">
                          <FontAwesomeIcon style={{color: "#EAB308",}}  icon={faEgg} />
                        </div>
                        <div className="text-wrapper">
                          <div className="label">Ngày rụng trứng tiếp theo</div>
                          <div className="value">{ovulation.format("DD/MM/YYYY")} </div>
                        </div>
                      </li>

                      <li className="prediction-item">
                        <div className="icon-wrapper">
                          <FontAwesomeIcon style={{color: "#22C55E",}} icon={faHeartCircleBolt} />
                        </div>
                        <div className="text-wrapper">
                          <div className="label">Khả năng thụ thai cao</div>
                          <div className="value">{ovulation.clone().subtract(2, "day").format("DD/MM")} → {ovulation.clone().add(2, "day").format("DD/MM")}</div>
                        </div>
                      </li>

                      <li className="prediction-item">
                        <div className="icon-wrapper">
                          <FontAwesomeIcon style={{color: "#DB2777",}} icon={faCalendarDays} />
                        </div>
                        <div className="text-wrapper">
                          <div className="label">Kỳ kinh tiếp theo dự kiến</div>
                          <div className="value">{startDate.format("DD/MM")} → {endDate.format("DD/MM")}</div>
                        </div>
                      </li>

                      <li className="prediction-item">
                        <div className="icon-wrapper">
                          <FontAwesomeIcon style={{color: "#F87171",}}  icon={faTriangleExclamation} />
                        </div>
                        <div className="text-wrapper">
                          <div className="label">Cảnh báo chu kỳ</div>
                          <div className="value">Bình thường</div>
                        </div>
                      </li>
                    </ul>
                  );
                })()
              ) : (
                <p>Chưa có dữ liệu</p>
              )}
            </div>
          </Col>

          <Col span={24}>
            <div className="history-section">
              <div className="history-header">
                <div className="history-header-title">
                  <FontAwesomeIcon icon={faRotateLeft} className="icon" />
                  <span>Lịch sử chu kỳ</span>
                </div>
                {cycles.length > 3 && (
                  <a className="view-all" onClick={() => setIsHistoryModalVisible(true)}>Xem tất cả</a>
                )}
              </div>
              <Table
                dataSource={cycles.slice(0, 3).map((c, i) => ({ ...c, key: i }))}
                columns={columns}
                pagination={false}
                bordered={false}
                className="custom-cycle-table"
              />
            </div>
          </Col>
        </Row>

        <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultTab={defaultTab} />

        <Modal
          title="Tất cả lịch sử chu kỳ"
          open={isHistoryModalVisible}
          onCancel={() => setIsHistoryModalVisible(false)}
          footer={null}
          width={700}
        >
          <Table
            dataSource={cycles.map((c, i) => ({ ...c, key: i }))}
            columns={columns}
            pagination={{ pageSize: 5 }}
            bordered
          />
        </Modal>

        <Modal
          className="cycle-form-modal"
          title={<h3 className="modal-title">Khai báo chu kỳ kinh</h3>}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={() => {
            setIsModalVisible(false); 
            form.resetFields();
          }}
          okText="Lưu chu kỳ"
          cancelButtonProps={{ style: { display: "none" } }}
          centered
        >
          <Form layout="vertical" form={form}>
            <Form.Item name="startDate" label="Ngày bắt đầu kỳ kinh" rules={[{ required: true , message: "Vui lòng chọn ngày bắt đầu" }]}>
              <DatePicker format="DD-MM-YYYY" style={{ width: "100%" }} placeholder="dd-mm-yyyy" className="custom-input" />
            </Form.Item>
            <Form.Item name="cycleLength" label="Độ dài chu kỳ (ngày)" rules={[{ required: true , message: "Vui lòng nhập độ dài chu kỳ" }]}>
              <InputNumber min={20} max={40} step={1} style={{ width: "100%" }} placeholder="Nhập số ngày" className="custom-input"  />
            </Form.Item>
            <Form.Item name="periodLength" label="Số ngày hành kinh" rules={[{ required: true , message: "Vui lòng nhập số ngày hành kinh" }]}>
              <InputNumber min={1} max={10} step={1} style={{ width: "100%" }} placeholder="Nhập số ngày" className="custom-input" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </MainLayout>
  );
}

export default ReproductiveCycle;
