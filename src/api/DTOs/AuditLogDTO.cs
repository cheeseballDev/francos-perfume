namespace InventorySystemBackend.DTOs
{
    public class AuditLogDTO
    {
        public string? employee_display_id { get; set; }
        public string? branch_display_id { get; set; }

        public required string log_action { get; set; }
        public required string log_module { get; set; }

        public DateTime log_timestamp { get; set; } = DateTime.UtcNow;
    }
}
