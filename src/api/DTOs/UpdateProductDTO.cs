namespace InventorySystemBackend.DTOs
{
    public class UpdateProductDTO
    {
        public required string product_name { get; set; }
        public required string product_type { get; set; }

        public string? product_note { get; set; }
        public string? product_gender { get; set; }
        public required string product_barcode { get; set; }
        public string? product_description { get; set; }
        public decimal product_price { get; set; } = 0.0m;
        public string product_image_url { get; set; } = string.Empty;
    }
}
