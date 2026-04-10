namespace InventorySystemBackend.DTOs
{
    public class UpdateProductDTO
    {
        public required string product_name { get; set; }
        public required string product_type { get; set; }

        public string? product_note { get; set; }
        public string? product_gender { get; set; }

        public DateTime product_date_created { get; set; } = DateTime.UtcNow;
        public required string product_barcode { get; set; }
        public required string product_status { get; set; }
        public string? product_description { get; set; }

    }
}
