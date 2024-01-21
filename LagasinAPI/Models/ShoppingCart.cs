namespace LagasinAPI.Models
{
    public class ShoppingCart
    {
        public int UserId { get; set; }
        public List<Product> Products { get; set; } = new List<Product>();
    }
}
