import React, { useState, useEffect } from 'react';
import { dashboardApi } from '../../services/api';
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
                    month: monthYear.month + 1, // Chuyển từ 0-11 sang 1-12
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

    return (
        <div className="manager-dashboard">
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
            </div>
        </div>
    );
};

export default ManagerDashboard;
