namespace LagasinAPI.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public ProductSize Size { get; set; }
        public string Description { get; set; }
        public string Category { get; set; }
        public int Quantity { get; set; }
        public string ImageUrl { get; set; }
        public string ProductUrl { get; set; }


    }
}
