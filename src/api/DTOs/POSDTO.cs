namespace InventorySystemBackend.DTOs
{
    public class POSDTO
    {
        public string payment_method { get; set; } = string.Empty;
        public decimal amount_paid { get; set; }
        public int discount_id { get; set; } = 0;
        public List<SalesOrderItemDTO> items { get; set; } = new();
    }
}
