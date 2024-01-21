using LagasinAPI.Data;
using LagasinAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

[Route("api/orders")]
[ApiController]

public class OrderController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ShoppingCart _shoppingCart;

    public OrderController(ApplicationDbContext context, ShoppingCart shoppingCart)
    {
        _context = context;
        _shoppingCart = shoppingCart;
    }

    [HttpPost("place")]
    public async Task<IActionResult> PlaceOrder()
    {

        var currentUserId = _shoppingCart.UserId;
        var currentUser = await _context.Users.FirstOrDefaultAsync(u => u.Id == currentUserId);



        if (currentUser == null)
        {
            return Unauthorized("Invalid user");
        }

        // Pobierz zawartość koszyka z sesji
        var cartProducts = _shoppingCart.Products;

        if (cartProducts == null || cartProducts.Count == 0)
        {
            return BadRequest("Empty shopping cart. Add products to the cart before placing an order.");
        }

        // Stwórz nowe zamówienie
        var order = new Order
        {
            UserId = currentUser.Id,
            FirstName = currentUser.FirstName,
            LastName = currentUser.LastName,
            Email = currentUser.Email,
            OrderDate = DateTime.Now,
            OrderProducts = cartProducts.Select(p => new OrderProduct
            {
                Name = p.Name,
                Price = (p.Price * p.Quantity),
                ProductId = p.Id,
                Quantity = p.Quantity
            }).ToList()
        };

        // Wyczyść koszyk po złożeniu zamówienia
        _shoppingCart.Products.Clear();

        // Dodaj zamówienie do bazy danych
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        return Ok($"Order successfully placed with ID: {order.Id}");
    }


    [HttpGet("userorder/{userId}")]
    public IActionResult GetUserOrdersById(int userId)
    {
        var userOrders = _context.Orders
            .Include(order => order.OrderProducts)
            .Where(order => order.UserId == userId)
            .ToList();

        if (userOrders != null && userOrders.Any())
        {
            var ordersData = userOrders.Select(order => new
            {
                OrderId = order.Id,
                OrderDate = order.OrderDate,
                OrderProducts = order.OrderProducts.ToList().Select(op => new
                {
                    Quantity = op.Quantity,
                    ProductName = op.Name
                }).ToList()

            });

            return Ok(ordersData);
        }
        else
        {
            return NotFound($"Brak zamówień dla użytkownika o ID {userId}.");
        }
    }





}
