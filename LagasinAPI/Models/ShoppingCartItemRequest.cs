namespace LagasinAPI.Models
{
    public class ShoppingCartItemRequest
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public ProductSize Size { get; set; }
    }
}
