namespace InventorySystemBackend.DTOs
{
    public class InventoryDisplayDTO
    {
        public int ProductId { get; set; }
        public required string ProductDisplayId { get; set; }
        public required string ProductName { get; set; }
        public required string ProductType { get; set; }
        public required string ProductStatus { get; set; }
        public int Quantity { get; set; }
    }
}
