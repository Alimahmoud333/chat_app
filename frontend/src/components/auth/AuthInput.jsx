export default function AuthInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  required = false,
  error,
}) {
  return (
    <div className="mb-3">
      {label && <label className="form-label fw-semibold">{label}</label>}

      <div className="input-group">
        {icon && (
          <span className="input-group-text bg-white">
            <i className={`bi ${icon}`}></i>
          </span>
        )}

        <input
          type={type}
          name={name}
          className={`form-control ${error ? "is-invalid" : ""}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
        />

        {error && <div className="invalid-feedback">{error}</div>}
      </div>
    </div>
  );
}
