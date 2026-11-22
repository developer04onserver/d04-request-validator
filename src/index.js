const isPlainObject = value => value !== null && typeof value === "object" && !Array.isArray(value);
export function validate(data, schema, { allowUnknown = false } = {}) {
  const errors = [];
  if (!isPlainObject(data)) return { valid: false, errors: [{ path: "$", code: "type", message: "Expected an object" }] };
  for (const [key, rule] of Object.entries(schema)) {
    const value = data[key]; const path = "$." + key;
    if (value === undefined || value === null) { if (rule.required) errors.push({ path, code: "required", message: "Field is required" }); continue; }
    const validType = rule.type === "array" ? Array.isArray(value) : rule.type === "object" ? isPlainObject(value) : typeof value === rule.type;
    if (!validType) { errors.push({ path, code: "type", message: "Expected " + rule.type }); continue; }
    if (typeof value === "string") {
      if (rule.minLength != null && value.length < rule.minLength) errors.push({ path, code: "min_length", message: "Value is too short" });
      if (rule.maxLength != null && value.length > rule.maxLength) errors.push({ path, code: "max_length", message: "Value is too long" });
      if (rule.pattern && !(new RegExp(rule.pattern).test(value))) errors.push({ path, code: "pattern", message: "Value has an invalid format" });
    }
    if (typeof value === "number") {
      if (!Number.isFinite(value)) errors.push({ path, code: "finite", message: "Number must be finite" });
      if (rule.min != null && value < rule.min) errors.push({ path, code: "min", message: "Number is below minimum" });
      if (rule.max != null && value > rule.max) errors.push({ path, code: "max", message: "Number exceeds maximum" });
    }
    if (rule.enum && !rule.enum.includes(value)) errors.push({ path, code: "enum", message: "Value is not an allowed option" });
    if (rule.validate && !rule.validate(value, data)) errors.push({ path, code: "custom", message: rule.message ?? "Custom validation failed" });
  }
  if (!allowUnknown) for (const key of Object.keys(data)) if (!(key in schema)) errors.push({ path: "$." + key, code: "unknown", message: "Unknown field" });
  return { valid: errors.length === 0, errors };
}
export function createValidator(schema, options) {
  return (req, res, next) => {
    const result = validate(req.body, schema, options);
    if (!result.valid) return res.status(400).json({ error: "validation_failed", details: result.errors });
    return next();
  };
}