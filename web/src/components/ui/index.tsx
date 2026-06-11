/** Shared UI Components — Button, Card, Badge, Modal, Table, Spinner, etc. */

import React from 'react';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

// ─── Button ─────────────────────────────────────────────────

type BtnVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type BtnSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: BtnSize;
  loading?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size === 'md' ? '' : size} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" /> : icon}
      {children}
    </button>
  );
}

// ─── Spinner ────────────────────────────────────────────────

export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <div className={`spinner${size === 'lg' ? ' spinner-lg' : ''}`} style={size === 'sm' ? { width: 14, height: 14, borderWidth: 2 } : {}} />;
}

// ─── Card ───────────────────────────────────────────────────

interface CardProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function Card({ title, subtitle, action, children, className = '', style }: CardProps) {
  return (
    <div className={`card ${className}`} style={style}>
      {(title || action) && (
        <div className="card-header">
          <div>
            {title && <div className="card-title">{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// ─── Stat Card ──────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeDir?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export function StatCard({ label, value, change, changeDir = 'neutral', icon, color = 'blue' }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className={`stat-card-icon ${color}`}>{icon}</div>
      <div className="stat-card-body">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{typeof value === 'number' ? value.toLocaleString() : value}</div>
        {change && (
          <div className={`stat-card-change ${changeDir}`}>{change}</div>
        )}
      </div>
    </div>
  );
}

// ─── Badge ──────────────────────────────────────────────────

type BadgeColor = 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'grey';

interface BadgeProps {
  color?: BadgeColor;
  dot?: boolean;
  children: React.ReactNode;
}

export function Badge({ color = 'grey', dot = false, children }: BadgeProps) {
  return (
    <span className={`badge badge-${color}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

// Status badge mapping
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { color: BadgeColor; label: string }> = {
    generated:     { color: 'blue', label: 'Generated' },
    distributed:   { color: 'yellow', label: 'Distributed' },
    key_released:  { color: 'green', label: 'Key Released' },
    DRAFT:         { color: 'grey', label: 'Draft' },
    ENCRYPTED:     { color: 'purple', label: 'Encrypted' },
    ACTIVE:        { color: 'green', label: 'Active' },
    COMPILED:      { color: 'blue', label: 'Compiled' },
    DISTRIBUTED:   { color: 'yellow', label: 'Distributed' },
    KEY_RELEASED:  { color: 'green', label: 'Key Released' },
    COMPLETED:     { color: 'grey', label: 'Completed' },
    Easy:          { color: 'green', label: 'Easy' },
    Medium:        { color: 'yellow', label: 'Medium' },
    Hard:          { color: 'red', label: 'Hard' },
    valid:         { color: 'green', label: 'Valid' },
    tampered:      { color: 'red', label: 'Tampered' },
    LOW:           { color: 'green', label: 'Low' },
    MEDIUM:        { color: 'yellow', label: 'Medium' },
    HIGH:          { color: 'red', label: 'High' },
    CRITICAL:      { color: 'red', label: 'Critical' },
    active:        { color: 'green', label: 'Active' },
    inactive:      { color: 'grey', label: 'Inactive' },
  };
  const cfg = map[status] ?? { color: 'grey' as BadgeColor, label: status };
  return <Badge color={cfg.color} dot>{cfg.label}</Badge>;
}

// ─── Modal ──────────────────────────────────────────────────

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Modal({ open, onClose, title, children, footer, size = 'md' }: ModalProps) {
  if (!open) return null;
  const maxWidth = size === 'sm' ? 400 : size === 'lg' ? 760 : 560;

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal" style={{ maxWidth }}>
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="icon-btn" onClick={onClose}><X size={16} /></button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Empty State ─────────────────────────────────────────────

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}

// ─── Loading State ───────────────────────────────────────────

export function LoadingState({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="loading-state">
      <Spinner size="lg" />
      <p>{message}</p>
    </div>
  );
}

// ─── Error State ─────────────────────────────────────────────

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="error-state">
      <AlertCircle size={32} color="var(--danger)" />
      <h3>Something went wrong</h3>
      <p>{message}</p>
      {onRetry && <Button variant="outline" onClick={onRetry}>Retry</Button>}
    </div>
  );
}

// ─── Alert ───────────────────────────────────────────────────

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export function Alert({ variant = 'info', children }: { variant?: AlertVariant; children: React.ReactNode }) {
  const icons = { info: Info, success: CheckCircle, warning: AlertTriangle, danger: AlertCircle };
  const Icon = icons[variant];
  return (
    <div className={`alert alert-${variant}`}>
      <Icon size={16} style={{ flexShrink: 0, marginTop: 1 }} />
      <div>{children}</div>
    </div>
  );
}

// ─── Confirm Dialog ──────────────────────────────────────────

interface ConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false, loading = false }: ConfirmProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm" footer={
      <div className="flex gap-3">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button variant={danger ? 'danger' : 'primary'} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
      </div>
    }>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{message}</p>
    </Modal>
  );
}

// ─── Form Group ──────────────────────────────────────────────

interface FormGroupProps {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}

export function FormGroup({ label, required, hint, children }: FormGroupProps) {
  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span style={{ color: 'var(--danger)', marginLeft: 2 }}>*</span>}
      </label>
      {children}
      {hint && <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{hint}</span>}
    </div>
  );
}

// ─── Table ───────────────────────────────────────────────────

interface Column<T> {
  key: string;
  label: string;
  width?: string | number;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface TableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  keyField: keyof T;
  onRowClick?: (row: T) => void;
}

export function Table<T extends Record<string, unknown>>({ columns, data, keyField, onRowClick }: TableProps<T>) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key} style={{ width: col.width }}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr
              key={String(row[keyField])}
              onClick={() => onRowClick?.(row)}
              style={onRowClick ? { cursor: 'pointer' } : {}}
            >
              {columns.map(col => (
                <td key={col.key}>
                  {col.render
                    ? col.render(row[col.key], row)
                    : String(row[col.key] ?? '')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Tabs ────────────────────────────────────────────────────

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab ${active === tab.id ? 'active' : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span style={{ marginLeft: 6, fontSize: 11, background: 'var(--surface-2)', padding: '1px 6px', borderRadius: 99, color: 'var(--text-muted)' }}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  breadcrumb?: string[];
}

export function PageHeader({ title, subtitle, actions, breadcrumb }: PageHeaderProps) {
  return (
    <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        {breadcrumb && (
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
            {breadcrumb.join(' / ')}
          </div>
        )}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actions && <div className="flex gap-3 items-center">{actions}</div>}
    </div>
  );
}
