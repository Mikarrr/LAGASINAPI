using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using System;
using System.Net;
using System.Net.Mail;
using LagasinAPI.Data;
using LagasinAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;

namespace APITEST.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ShoppingCart _shoppingCart;
        private readonly IConfiguration _configuration;


        public UserController(ApplicationDbContext context, IConfiguration configuration, ShoppingCart shoppingCart)
        {
            _context = context;
            _configuration = configuration;
            _shoppingCart = shoppingCart;

        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterRequest request)
        {
            // Sprawdź czy hasło spełnia wymagania
            if (!IsPasswordValid(request.Password))
            {
                return BadRequest("Password must be at least 8 characters long and contain at least one uppercase letter, one special character, and one digit.");
            }

            if (await _context.Users.AnyAsync(u => u.Email == request.Email))
            {
                return BadRequest("User with this email already exists.");
            }

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            var user = new User
            {
                Email = request.Email,
                PassowrdHash = passwordHash,
                PasswordSalt = passwordSalt,
                VerificationToken = CreateRandomToken(),
                FirstName = request.FirstName,
                LastName = request.LastName,
                AcceptTermsAndConditions = request.AcceptTermsAndConditions,
                Role = UserRole.User,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            await SendVerificationEmail(user.Email, user.VerificationToken);

            return Ok($"User successfully created, {user.Id}");
        }

        private bool IsPasswordValid(string password)
        {
           
            var passwordRegex = new Regex(@"^(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$");
            return passwordRegex.IsMatch(password);
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginRequest request)
        {


            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
            if (user == null)
            {
                return BadRequest("User not found");
            }

            if (user.VerifiedAt == null)
            {
                return BadRequest("Not verified!");
            }

            if (!VerifyPasswordHash(request.Password, user.PassowrdHash, user.PasswordSalt))
            {
                return BadRequest("Password is incorrect");
            }

            _shoppingCart.UserId = user.Id;
       
               
            string token = CreateToken(user);

            return Ok(token);
        }

        private string CreateToken(User user)
        {
           
            var userFromDatabase = _context.Users.FirstOrDefault(u => u.Id == user.Id);
            if (userFromDatabase == null)
            {
              
                throw new InvalidOperationException("User not found in the database.");
            }

          
            UserRole userRole = userFromDatabase.Role;

            List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.FirstName),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

   
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value!));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                    claims: claims,
                    expires: DateTime.Now.AddDays(12),
                    signingCredentials: creds
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }




        [HttpGet("verify")]
        public async Task<IActionResult> Verify(string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.VerificationToken == token);
            if (user == null)
            {
                return BadRequest("Invalid token.");
            }

            if (user.VerifiedAt != null)
            {
                return BadRequest("User already verified.");
            }

            user.VerifiedAt = DateTime.Now;
            await _context.SaveChangesAsync();

            return Redirect("../../pages/login.html");
        
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null)
            {
                return BadRequest("User not found.");
            }

            user.PasswordResetToken = CreateRandomToken();
            user.ResetTokenExpires = DateTime.Now.AddDays(1);
            await _context.SaveChangesAsync();

            await SendPasswordResetEmail(user.Email, user.PasswordResetToken);

            return Ok("Password reset token has been sent to your email. You may now reset your password.");
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == request.PasswordResetToken);
            if (user == null || user.ResetTokenExpires < DateTime.Now)
            {
                return BadRequest("Invalid token.");
            }

            CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);

            user.PassowrdHash = passwordHash;
            user.PasswordSalt = passwordSalt;
            user.PasswordResetToken = null;
            user.ResetTokenExpires = null;
            await _context.SaveChangesAsync();

            return Ok("Password successfully reset");
        }

        [HttpGet("getall")]
        [Authorize(Roles = "Administrator")]
        public IActionResult GetAllUsers()
        {
            var users = _context.Users.ToList();

            if (users.Any())
            {
                return Ok(users.Select(u => new
                {
                    Id = u.Id,
                    Email = u.Email,
                    FirstName = u.FirstName,
                    LastName = u.LastName,                   
                }));
            }
            else
            {
                return NotFound("Empty user list.");
            }
        }


        [HttpGet("getbyid/{id}")]

        public IActionResult GetUserById(int id)
        {
            var user = _context.Users.Find(id);

            if (user != null)
            {
                return Ok(new
                {
                    Id = user.Id,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                });
            }
            else
            {
                return NotFound($"User with ID {id} not found.");
            }
        }





        [HttpDelete("delete/{userId}")]
        [Authorize(Roles = "Administrator")]
        public async Task<IActionResult> DeleteUser(int userId)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok($"User with ID {userId} has been successfully deleted.");
        }

        [HttpPut("edit/{userId}/{newEmail}/{newFirstName}/{newLastName}")]
      
        public async Task<IActionResult> EditUser(int userId, string newEmail, string newFirstName, string newLastName)
        {
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
            {
                return NotFound("User not found.");
            }
            user.FirstName = newFirstName;
            user.LastName = newLastName;
            user.Email = newEmail;

            await _context.SaveChangesAsync();

            return Ok($"User with ID {userId} has been successfully updated.");
        }

      


        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        private bool VerifyPasswordHash(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512(passwordSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(passwordHash);
            }
        }

        private string CreateRandomToken()
        {
            return Convert.ToHexString(RandomNumberGenerator.GetBytes(64));
        }

        private async Task SendVerificationEmail(string userEmail, string token)
        {
          
            using (SmtpClient smtpClient = new SmtpClient("smtp.gmail.com"))
            {
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential("mikserkis@gmail.com", "sktb wnbp vtge qdyw");
                smtpClient.EnableSsl = true;
                smtpClient.Port = 587;

             
                MailMessage mailMessage = new MailMessage
                {
                    From = new MailAddress("mikserkis@gmail.com"),
                    Subject = "Account Verification",
                    Body = $"Hello,\n\nPlease click the following link to verify your account: " +
                           $"https://localhost:7140/api/user/verify?token={token}\n\nBest regards,\nYour App"
                };

           
                mailMessage.To.Add(userEmail);

        
                await smtpClient.SendMailAsync(mailMessage);
            }
        }

        private async Task SendPasswordResetEmail(string userEmail, string token)
        {
            using (SmtpClient smtpClient = new SmtpClient("smtp.gmail.com"))
            {
                smtpClient.UseDefaultCredentials = false;
                smtpClient.Credentials = new NetworkCredential("mikserkis@gmail.com", "sktb wnbp vtge qdyw");
                smtpClient.EnableSsl = true;
                smtpClient.Port = 587;

                MailMessage mailMessage = new MailMessage
                {
                    From = new MailAddress("mikserkis@gmail.com"),
                    Subject = "Password Reset",
                    Body = $"Hello,\n\nYou have requested to reset your password. Please click the following link to reset your password: " +
                           $"https://localhost:7140/api/user/reset-password?token={token}\n\nBest regards,\nYour App"
                };

                mailMessage.To.Add(userEmail);

                await smtpClient.SendMailAsync(mailMessage);
            }
        }


    }
}
