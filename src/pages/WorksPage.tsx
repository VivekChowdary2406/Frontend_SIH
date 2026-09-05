import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { dataService, WorksFilterOptions } from '../services/dataService';
import { WorkStatus, RiskLevel, WorkCategory, HouseType } from '../types/work';
import { RiskBadge } from '../components/common/RiskBadge';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';
import { 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ArrowUpDown, 
  RotateCcw 
} from 'lucide-react';

export const WorksPage: React.FC = () => {
  const { navigateToWork } = useApp();

  const [query, setQuery] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [houseFilter, setHouseFilter] = useState<HouseType | 'ALL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<WorkCategory | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<WorkStatus | 'ALL'>('ALL');
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [fyFilter, setFyFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState<WorksFilterOptions['sortBy']>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filterOptions: WorksFilterOptions = {
    query,
    state: stateFilter,
    house: houseFilter,
    category: categoryFilter,
    status: statusFilter,
    riskLevel: riskFilter,
    financialYear: fyFilter,
    sortBy,
    sortOrder,
    page,
    pageSize
  };

  const { data: works, totalCount, totalPages } = dataService.getWorks(filterOptions);
  const allStates = dataService.getStates();

  const hasActiveFilters = 
    query.trim() !== '' || 
    stateFilter !== 'ALL' || 
    houseFilter !== 'ALL' || 
    categoryFilter !== 'ALL' || 
    statusFilter !== 'ALL' || 
    riskFilter !== 'ALL' || 
    fyFilter !== 'ALL';

  const handleClearFilters = () => {
    setQuery('');
    setStateFilter('ALL');
    setHouseFilter('ALL');
    setCategoryFilter('ALL');
    setStatusFilter('ALL');
    setRiskFilter('ALL');
    setFyFilter('ALL');
    setPage(1);
  };

  const handleSort = (field: WorksFilterOptions['sortBy']) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Page Title & Count */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text-primary)' }}>
            MPLADS Works Exploration & Surveillance Directory
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Comprehensive directory of recommended, sanctioned, ongoing, and completed MPLADS projects
          </p>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Showing <strong>{works.length}</strong> of <strong>{totalCount}</strong> works
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Search Box */}
        <div className="search-input-box" style={{ flex: '1 1 240px' }}>
          <Search size={15} color="#64748b" />
          <input
            type="text"
            placeholder="Search by Work ID, title, MP name, constituency..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
          {query && (
            <button className="btn-icon" onClick={() => setQuery('')}>
              <X size={13} />
            </button>
          )}
        </div>

        {/* State Filter */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={stateFilter}
            onChange={(e) => { setStateFilter(e.target.value); setPage(1); }}
            aria-label="Filter by State"
          >
            <option value="ALL">All States</option>
            {allStates.map(s => <option key={s.stateId} value={s.name}>{s.name}</option>)}
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value as any); setPage(1); }}
            aria-label="Filter by Category"
          >
            <option value="ALL">All Categories</option>
            <option value="Health & Family Welfare">Health & Maternity</option>
            <option value="Electricity & Solar Lighting">Electricity & Solar</option>
            <option value="Drinking Water">Drinking Water</option>
            <option value="Roads, Pathways & Bridges">Roads & Bridges</option>
            <option value="Education & Libraries">Education & Libraries</option>
            <option value="Sanitation & Public Health">Sanitation</option>
            <option value="Sports & Youth Development">Sports & Youth</option>
            <option value="Irrigation & Flood Control">Irrigation</option>
            <option value="Community Infrastructure">Community Infra</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value as any); setPage(1); }}
            aria-label="Filter by Status"
          >
            <option value="ALL">All Statuses</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="SANCTIONED">Sanctioned</option>
          </select>
        </div>

        {/* Risk Level Filter */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={riskFilter}
            onChange={(e) => { setRiskFilter(e.target.value as any); setPage(1); }}
            aria-label="Filter by Risk Level"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="HIGH">High Risk</option>
            <option value="MEDIUM">Medium Risk</option>
            <option value="LOW">Low Risk / Normal</option>
          </select>
        </div>

        {/* Financial Year Filter */}
        <div className="filter-group">
          <select 
            className="filter-select"
            value={fyFilter}
            onChange={(e) => { setFyFilter(e.target.value); setPage(1); }}
            aria-label="Filter by Financial Year"
          >
            <option value="ALL">All Fiscal Years</option>
            <option value="2023-2024">FY 2023-2024</option>
            <option value="2022-2023">FY 2022-2023</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleClearFilters}
            title="Reset all search filters"
          >
            <RotateCcw size={12} />
            <span>Clear Filters</span>
          </button>
        )}

        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="filter-chips">
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Active:</span>
            {query && (
              <span className="filter-chip">
                Query: "{query}"
                <X size={11} className="filter-chip-remove" onClick={() => setQuery('')} />
              </span>
            )}
            {stateFilter !== 'ALL' && (
              <span className="filter-chip">
                State: {stateFilter}
                <X size={11} className="filter-chip-remove" onClick={() => setStateFilter('ALL')} />
              </span>
            )}
            {categoryFilter !== 'ALL' && (
              <span className="filter-chip">
                Category: {categoryFilter}
                <X size={11} className="filter-chip-remove" onClick={() => setCategoryFilter('ALL')} />
              </span>
            )}
            {statusFilter !== 'ALL' && (
              <span className="filter-chip">
                Status: {statusFilter}
                <X size={11} className="filter-chip-remove" onClick={() => setStatusFilter('ALL')} />
              </span>
            )}
            {riskFilter !== 'ALL' && (
              <span className="filter-chip">
                Risk: {riskFilter}
                <X size={11} className="filter-chip-remove" onClick={() => setRiskFilter('ALL')} />
              </span>
            )}
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="table-container">
        {works.length === 0 ? (
          <EmptyState
            title="No Matching Works Found"
            description="Adjust your search parameters, clear filters, or select a different state."
            action={
              <button className="btn btn-secondary btn-sm" onClick={handleClearFilters}>
                Clear All Filters
              </button>
            }
          />
        ) : (
          <>
            <table className="data-table" role="table" aria-label="Works surveillance table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>Work ID</th>
                  <th style={{ width: '30%' }}>Work</th>
                  <th style={{ width: '13%' }}>State</th>
                  <th 
                    style={{ width: '12%' }} 
                    className="sortable" 
                    onClick={() => handleSort('sanctionAmount')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Sanction Amount</span>
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th 
                    style={{ width: '12%' }} 
                    className="sortable" 
                    onClick={() => handleSort('expenditure')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Expenditure</span>
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                  <th style={{ width: '9%' }}>Status</th>
                  <th 
                    style={{ width: '9%' }} 
                    className="sortable" 
                    onClick={() => handleSort('riskScore')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>Risk</span>
                      <ArrowUpDown size={11} />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {works.map((work) => (
                  <tr 
                    key={work.workId}
                    className="row-clickable"
                    onClick={() => navigateToWork(work.workId)}
                    title="Click to open Work Details"
                  >
                    <td>
                      <span className="mono-tag" style={{ color: 'var(--gov-blue-primary)' }}>
                        {work.workId}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                        {work.title}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        MP: {work.mpName} ({work.constituency}) · {work.category}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{work.state}</span>
                    </td>
                    <td className="num-tabular" style={{ fontWeight: 600 }}>
                      ₹{(work.sanctionAmount / 100000).toFixed(2)}L
                    </td>
                    <td className="num-tabular" style={{ color: 'var(--gov-green-dark)', fontWeight: 600 }}>
                      ₹{(work.expenditure / 100000).toFixed(2)}L
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>
                        {work.utilizationPercentage.toFixed(0)}% Util.
                      </span>
                    </td>
                    <td>
                      <StatusBadge status={work.status} />
                    </td>
                    <td>
                      <RiskBadge level={work.finalRiskLevel} score={work.finalRiskScore} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-bar">
              <div>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong> ({totalCount} total records)
              </div>
              <div className="pagination-controls">
                <button 
                  className="btn btn-secondary btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={14} />
                  <span>Previous</span>
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
