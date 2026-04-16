namespace InventorySystemBackend.DTOs
{
    public class InventoryDTO
    {
        public int product_id { get; set; }
        public required string product_display_id { get; set; }
        public required string product_name { get; set; }
        public required string product_type { get; set; }
        public required string product_status { get; set; }
        public int quantity { get; set; } = 0;
    }
}
