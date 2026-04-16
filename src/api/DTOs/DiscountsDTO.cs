namespace InventorySystemBackend.DTOs
{
    public class DiscountsDTO
    {
        public required string discount_name { get; set; }
        public decimal discount_percent { get; set; } = 0;
        public decimal discount_amount { get; set; } = 0;
        public required string discount_status { get; set; }
        public required string discount_prefix { get; set; }
    }
}
