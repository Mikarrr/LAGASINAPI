using LagasinAPI.Data;
using LagasinAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;


[Route("api/products")]
[ApiController]

public class ProductController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ShoppingCart _shoppingCart;

    public ProductController(ApplicationDbContext context, ShoppingCart shoppingCart)
    {
        _context = context;
        _shoppingCart = shoppingCart;
    }


    [HttpGet("view")]
    

    public async Task<ActionResult<IEnumerable<Product>>> Get()
    {
        var products = await _context.Products.ToListAsync();
        return Ok(products);
    }

    [HttpGet("view(id)")]

    public async Task<ActionResult<Product>> Get(int id)
    {
        var product = await _context.Products.FindAsync(id);

        if (product == null)
        {
            return NotFound();
        }

        return Ok(product);
    }


    [HttpGet("view(category)")]
  
    public async Task<ActionResult<IEnumerable<Product>>> GetByCategory([FromQuery] string category)
    {
        if (category == "all")
        {
            return await _context.Products.ToListAsync();
        }

        var productsByCategory = await _context.Products
            .Where(p => p.Category == category)
            .ToListAsync();

        if (!productsByCategory.Any())
        {
            return NotFound($"No products found in the category: {category}");
        }

        return Ok(productsByCategory);
    }



    [HttpPost("add")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<Product>> Post(Product newProduct)
    {

        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var product = new Product
        {

            Name = newProduct.Name,
            Price = newProduct.Price,
            Size = ProductSize.S,
            Description = newProduct.Description,
            Category = newProduct.Category,
            Quantity = 0,
            ImageUrl = newProduct.ImageUrl,
            ProductUrl = "none",
        };

        _context.Products.Add(product);
        await _context.SaveChangesAsync();

        return Ok($"Product successfully created, {product.Id}");
    }

 




    [HttpPut("edit/{editId}/{newName}/{newDesc}/{newPrice}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> EditProduct(int editId, string newName, string newDesc, int newPrice)
    {
        var existingProduct = await _context.Products.FindAsync(editId);

        if (existingProduct == null)
        {
            return NotFound("Product not found.");
        }

        existingProduct.Name = newName;
        existingProduct.Price = newPrice;
        existingProduct.Description = newDesc;
        await _context.SaveChangesAsync();

        return Ok($"Product with ID {editId} has been successfully updated.");
    }

   

    [HttpDelete("delete/{productId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> Delete(int productId)
    {
        var productToRemove = await _context.Products.FindAsync(productId);

        if (productToRemove == null)
        {
            return NotFound("Product not found.");
        }

        _context.Products.Remove(productToRemove);
        await _context.SaveChangesAsync();

        return Ok("Product has been deleted.");
    }



    [HttpGet("cart")]
    public ActionResult<ShoppingCart> GetCart()
    {
        return Ok(_shoppingCart);
    }


    [HttpPost("addtocart/{productId}")]
    public async Task<ActionResult<ShoppingCart>> AddToCart(int productId, [FromQuery] ProductSize size, [FromQuery] int quantity)
    {
        var product = await _context.Products.FindAsync(productId);

        if (product == null)
        {
            return NotFound("Product not found.");
        }

    
        var existingProduct = _shoppingCart.Products.FirstOrDefault(p => p.Id == productId && p.Size == size);

        if (existingProduct != null)
        {
        
            existingProduct.Quantity += quantity;
        }
        else
        {
       
            product.Quantity = quantity;
            product.Size = size;

            _shoppingCart.Products.Add(product);
        }

        return Ok("Product has been successfully added to cart.");
    }




    [HttpPut("editcart/{productId}/{newQuantity}")]
    public ActionResult<ShoppingCart> EditCart(int productId, int newQuantity)
    {
        var productToUpdate = _shoppingCart.Products.FirstOrDefault(p => p.Id == productId);

        if (productToUpdate == null)
        {
            return NotFound("Produkt nie znaleziony w koszyku.");
        }

        newQuantity = Math.Max(1, newQuantity);

        productToUpdate.Quantity = newQuantity;

        return Ok("Ilość produktu w koszyku została pomyślnie zaktualizowana.");
    }




    [HttpDelete("removefromcart/{productId}")]
    public ActionResult<ShoppingCart> RemoveFromCart(int productId)
    {
        var productToRemove = _shoppingCart.Products.FirstOrDefault(p => p.Id == productId);

        if (productToRemove == null)
        {
            return NotFound("Product not found in the cart.");
        }

        _shoppingCart.Products.Remove(productToRemove);

        return Ok("Product has been successfully deleted from the cart.");
    }
}

