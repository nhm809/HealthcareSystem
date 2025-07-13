import React, { useState, useEffect } from 'react';
import { dashboardApi, invoiceApi, feedbackApi } from '../../services/api';
import './ManagerDashboard.css';

const ManagerDashboard = () => {
    const [revenueData, setRevenueData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filterType, setFilterType] = useState('dateRange');
    const [dateRange, setDateRange] = useState({
        start: new Date().toISOString().split('T')[0],
        end: new Date().toISOString().split('T')[0]
    });
    const [monthYear, setMonthYear] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear()
    });
    const [year, setYear] = useState(new Date().getFullYear());
    const [invoiceData, setInvoiceData] = useState([]);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [feedbackData, setFeedbackData] = useState([]);
    const [feedbackLoading, setFeedbackLoading] = useState(false);
    const [showRevenueSection, setShowRevenueSection] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [serviceFeedbacks, setServiceFeedbacks] = useState([]);
    const [serviceFeedbackLoading, setServiceFeedbackLoading] = useState(false);
    const [serviceFeedbackPage, setServiceFeedbackPage] = useState(1);
    const [serviceFeedbackTotal, setServiceFeedbackTotal] = useState(0);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [serviceFeedbackPageSize] = useState(10);

    const fetchRevenue = async (requestData) => {
        setLoading(true);
        try {
            const response = await dashboardApi.getRevenue(requestData);
            setRevenueData(response.data);
        } catch (error) {
            console.error('Error fetching revenue data:', error);
            setRevenueData(null);
        } finally {
            setLoading(false);
        }
    };

    const fetchInvoices = async (requestData) => {
        setInvoiceLoading(true);
        try {
            const response = await invoiceApi.searchByDate(requestData);
            setInvoiceData(response.data || []);
        } catch (error) {
            console.error('Error fetching invoice data:', error);
            setInvoiceData([]);
        } finally {
            setInvoiceLoading(false);
        }
    };

    const fetchFeedback = async () => {
        setFeedbackLoading(true);
        try {
            const response = await feedbackApi.getServiceSummary();
            setFeedbackData(response.data || []);
        } catch (error) {
            console.error('Error fetching feedback data:', error);
            setFeedbackData([]);
        } finally {
            setFeedbackLoading(false);
        }
    };

    const openServiceFeedback = async (service) => {
        setSelectedService(service);
        setShowFeedbackModal(true);
        setServiceFeedbackPage(1);
        await fetchServiceFeedbacks(service.serviceId, 1);
    };

    const fetchServiceFeedbacks = async (serviceId, pageNumber) => {
        setServiceFeedbackLoading(true);
        try {
            const response = await feedbackApi.getFeedbacksByService(serviceId, pageNumber, serviceFeedbackPageSize);
            setServiceFeedbacks(response.data.feedbacks || []);
            setServiceFeedbackTotal(response.data.totalCount || response.data.feedbacks?.length || 0);
        } catch (error) {
            setServiceFeedbacks([]);
            setServiceFeedbackTotal(0);
        } finally {
            setServiceFeedbackLoading(false);
        }
    };

    const handleFeedbackPageChange = async (newPage) => {
        setServiceFeedbackPage(newPage);
        if (selectedService) {
            await fetchServiceFeedbacks(selectedService.serviceId, newPage);
        }
    };

    const closeFeedbackModal = () => {
        setShowFeedbackModal(false);
        setSelectedService(null);
        setServiceFeedbacks([]);
        setServiceFeedbackPage(1);
        setServiceFeedbackTotal(0);
    };

    useEffect(() => {
        fetchFeedback();
        // Load today's revenue by default
        const today = new Date().toISOString().split('T')[0];
        const defaultRequestData = {
            start: new Date(today).toISOString(),
            end: new Date(today).toISOString()
        };
        fetchRevenue(defaultRequestData);
        fetchInvoices(defaultRequestData);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        let requestData = {};

        switch (filterType) {
            case 'dateRange':
                requestData = {
                    start: new Date(dateRange.start).toISOString(),
                    end: new Date(dateRange.end).toISOString()
                };
                break;
            case 'monthYear':
                requestData = {
                    month: monthYear.month + 1,
                    year: monthYear.year
                };
                break;
            case 'year':
                requestData = { year };
                break;
            default:
                return;
        }

        fetchRevenue(requestData);
        fetchInvoices(requestData);
        setShowRevenueSection(true);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const getMonthName = (monthIndex) => {
        const months = [
            'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
            'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
        ];
        return months[monthIndex];
    };

    // Star rendering helper
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (rating >= i) {
                stars.push('full');
            } else if (rating >= i - 0.5) {
                stars.push('half');
            } else {
                stars.push('empty');
            }
        }
        return stars;
    };

    return (
        <div className="manager-dashboard">
            

            <div className="feedback-section">
                <h2>Thống kê đánh giá dịch vụ</h2>
                {feedbackLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Đang tải dữ liệu đánh giá...</p>
                    </div>
                ) : feedbackData && feedbackData.length > 0 ? (
                    <div className="feedback-cards">
                        {feedbackData.map((service) => (
                            <div key={service.serviceId} className="feedback-card" onClick={() => openServiceFeedback(service)} style={{ cursor: 'pointer' }}>
                                <div className="service-info">
                                    <h3>{service.serviceName}</h3>
                                    <div className="rating-display">
                                        <div className="stars">
                                            {renderStars(service.averageRating).map((type, idx) => (
                                                <span key={idx} className={`star ${type}`}>★</span>
                                            ))}
                                        </div>
                                        <span className="rating-text">
                                            {service.averageRating.toFixed(1)}/5.0
                                        </span>
                                    </div>
                                </div>
                                <div className="feedback-stats">
                                    <div className="stat-item">
                                        <span className="stat-label">Số đánh giá:</span>
                                        <span className="stat-value">{service.feedbackCount}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-label">Điểm trung bình:</span>
                                        <span className="stat-value">{service.averageRating.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="no-data">
                        <div className="no-data-icon">⭐</div>
                        <p>Chưa có dữ liệu đánh giá dịch vụ.</p>
                    </div>
                )}
                {showFeedbackModal && (
                    <div className="modal-overlay" onClick={closeFeedbackModal}>
                        <div className="modal-content" onClick={e => e.stopPropagation()}>
                            <button className="modal-close" onClick={closeFeedbackModal}>×</button>
                            <h2>Feedback cho dịch vụ: {selectedService?.serviceName}</h2>
                            {serviceFeedbackLoading ? (
                                <div className="loading-container">
                                    <div className="loading-spinner"></div>
                                    <p>Đang tải feedback...</p>
                                </div>
                            ) : serviceFeedbacks.length > 0 ? (
                                <div className="service-feedback-list">
                                    {serviceFeedbacks.map(fb => (
                                        <div key={fb.feedbackId} className="service-feedback-item">
                                            <div className="service-feedback-header">
                                                <span className="service-feedback-user">{fb.userName}</span>
                                                <span className="service-feedback-rating">
                                                    {renderStars(fb.rating).map((type, idx) => (
                                                        <span key={idx} className={`star ${type}`}>★</span>
                                                    ))}
                                                </span>
                                                <span className="service-feedback-date">{new Date(fb.createdAt).toLocaleString('vi-VN')}</span>
                                            </div>
                                            <div className="service-feedback-comment">{fb.comment}</div>
                                        </div>
                                    ))}
                                    {serviceFeedbackTotal > serviceFeedbackPageSize && (
                                        <div className="pagination">
                                            <button disabled={serviceFeedbackPage === 1} onClick={() => handleFeedbackPageChange(serviceFeedbackPage - 1)}>Trước</button>
                                            <span>Trang {serviceFeedbackPage}</span>
                                            <button disabled={serviceFeedbacks.length < serviceFeedbackPageSize} onClick={() => handleFeedbackPageChange(serviceFeedbackPage + 1)}>Sau</button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="no-data">
                                    <div className="no-data-icon">📝</div>
                                    <p>Không có feedback nào cho dịch vụ này.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="dashboard-header">
                <h1>Thống Kê Doanh Thu</h1>
                <p>Quản lý và theo dõi doanh thu hệ thống</p>
            </div>

            <div className="revenue-controls">
                <form onSubmit={handleSubmit} className="filter-form">
                    <div className="filter-type-selector">
                        <label>
                            <input
                                type="radio"
                                value="dateRange"
                                checked={filterType === 'dateRange'}
                                onChange={(e) => setFilterType(e.target.value)}
                            />
                            Khoảng thời gian
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="monthYear"
                                checked={filterType === 'monthYear'}
                                onChange={(e) => setFilterType(e.target.value)}
                            />
                            Theo tháng
                        </label>
                        <label>
                            <input
                                type="radio"
                                value="year"
                                checked={filterType === 'year'}
                                onChange={(e) => setFilterType(e.target.value)}
                            />
                            Theo năm
                        </label>
                    </div>

                    <div className="filter-inputs">
                        {filterType === 'dateRange' && (
                            <div className="date-range-inputs">
                                <div className="input-group">
                                    <label>Từ ngày:</label>
                                    <input
                                        type="date"
                                        value={dateRange.start}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Đến ngày:</label>
                                    <input
                                        type="date"
                                        value={dateRange.end}
                                        onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                                    />
                                </div>
                            </div>
                        )}

                        {filterType === 'monthYear' && (
                            <div className="month-year-inputs">
                                <div className="input-group">
                                    <label>Tháng:</label>
                                    <select
                                        value={monthYear.month}
                                        onChange={(e) => setMonthYear(prev => ({ ...prev, month: parseInt(e.target.value) }))}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i} value={i}>{getMonthName(i)}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Năm:</label>
                                    <input
                                        type="number"
                                        value={monthYear.year}
                                        onChange={(e) => setMonthYear(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                                        min="2020"
                                        max="2030"
                                    />
                                </div>
                            </div>
                        )}

                        {filterType === 'year' && (
                            <div className="year-input">
                                <div className="input-group">
                                    <label>Năm:</label>
                                    <input
                                        type="number"
                                        value={year}
                                        onChange={(e) => setYear(parseInt(e.target.value))}
                                        min="2020"
                                        max="2030"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Đang tải...' : 'Xem thống kê'}
                    </button>
                </form>
            </div>

            {showRevenueSection && (
                <div className="revenue-results">
                    {loading && (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Đang tải dữ liệu...</p>
                        </div>
                    )}

                    {!loading && revenueData && (
                        <div className="revenue-display">
                            <div className="revenue-summary">
                                <div className="summary-card total-revenue">
                                    <div className="card-icon">💰</div>
                                    <div className="card-content">
                                        <h3>Tổng doanh thu</h3>
                                        <p className="amount">{formatCurrency(revenueData.total || 0)}</p>
                                    </div>
                                </div>
                            </div>

                            {revenueData.dailyData && revenueData.dailyData.length > 0 && (
                                <div className="revenue-chart">
                                    <h3>Biểu đồ doanh thu theo ngày</h3>
                                    <div className="chart-container">
                                        {revenueData.dailyData.map((day, index) => (
                                            <div key={index} className="chart-bar">
                                                <div 
                                                    className="bar-fill"
                                                    style={{ 
                                                        height: `${Math.max(5, (day.total / Math.max(...revenueData.dailyData.map(d => d.total))) * 100)}%` 
                                                    }}
                                                ></div>
                                                <span className="bar-label">{formatCurrency(day.total)}</span>
                                                <span className="bar-date">{new Date(day.date).toLocaleDateString('vi-VN')}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {revenueData.monthlyData && revenueData.monthlyData.length > 0 && (
                                <div className="revenue-chart">
                                    <h3>Biểu đồ doanh thu theo tháng</h3>
                                    <div className="chart-container">
                                        {revenueData.monthlyData.map((month, index) => (
                                            <div key={index} className="chart-bar">
                                                <div 
                                                    className="bar-fill"
                                                    style={{ 
                                                        height: `${Math.max(5, (month.total / Math.max(...revenueData.monthlyData.map(m => m.total))) * 100)}%` 
                                                    }}
                                                ></div>
                                                <span className="bar-label">{formatCurrency(month.total)}</span>
                                                <span className="bar-date">{getMonthName(month.month - 1)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {!loading && !revenueData && (
                        <div className="no-data">
                            <div className="no-data-icon">📊</div>
                            <p>Chưa có dữ liệu doanh thu. Vui lòng chọn khoảng thời gian và nhấn "Xem thống kê".</p>
                        </div>
                    )}

                    <div className="invoice-section">
                        <h2>Danh sách hóa đơn</h2>
                        {invoiceLoading ? (
                            <div className="loading-container">
                                <div className="loading-spinner"></div>
                                <p>Đang tải hóa đơn...</p>
                            </div>
                        ) : invoiceData && invoiceData.length > 0 ? (
                            <div className="invoice-table-container">
                                <table className="invoice-table">
                                    <thead>
                                        <tr>
                                            <th>Mã hóa đơn</th>
                                            <th>Tổng tiền</th>
                                            <th>Phương thức</th>
                                            <th>Mã giao dịch</th>
                                            <th>Ngày tạo</th>
                                            <th>Ngày thanh toán</th>
                                            <th>Thuế</th>
                                            <th>Đơn vị</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoiceData.map((inv) => {
                                            // Tính thuế thành tiền: totalAmount đã bao gồm thuế
                                            // Thuế = Tổng tiền - (Tổng tiền / (1 + taxRate))
                                            const taxAmount = inv.totalAmount - (inv.totalAmount / (1 + inv.taxRate));
                                            return (
                                                <tr key={inv.invoiceId}>
                                                    <td>{inv.invoiceId}</td>
                                                    <td>{formatCurrency(inv.totalAmount)}</td>
                                                    <td>{inv.paymentMethod}</td>
                                                    <td>{inv.transactionId}</td>
                                                    <td>{inv.createdAt ? new Date(inv.createdAt).toLocaleString('vi-VN') : ''}</td>
                                                    <td>{inv.paidAt ? new Date(inv.paidAt).toLocaleString('vi-VN') : ''}</td>
                                                    <td>{formatCurrency(taxAmount)}</td>
                                                    <td>{inv.unitPrice}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="no-data">
                                <div className="no-data-icon">🧾</div>
                                <p>Không có hóa đơn nào cho bộ lọc này.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManagerDashboard;
