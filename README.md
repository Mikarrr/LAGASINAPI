LagasinAPI - Krótki Opis
LagasinAPI to prosty system e-commerce API, stworzony w środowisku ASP.NET Core, obsługujący podstawowe operacje związane z produktami, użytkownikami i zamówieniami. Poniżej znajdziesz krótki opis funkcji oraz jak zacząć korzystać z API.

Jak zacząć:

Sklonuj repozytorium
Uruchom projekt w środowisku ASP.NET Core.

Aplikacja wymaga dostosowania konfiguracji, takiej jak połączenie z bazą danych w folderze Data/ApplicationDbContext.cs należy dostosować połączenie z swoją bazą: 
string connectionString = "Data Source=TU DAJESZ SWÓJ SERVER;Initial Catalog=bazaLagasin;Integrated Security=True";
I teraz za pomocą SQL SERVER MANAGMENT STUDIO importujesz baze która znajduje się w folderze Data/bazaLagasin.bacpac.
Należy zobaczyć czy pakiety nuget działają poprawnie.
Teraz możesz uruchomić projekt.
Jeśli coś nie działa spróbuj dodać nową migracje i zaktualizować bazę :) add-migarion nazwa, update-database
Sprawdź dokumentację API w kodzie lub korzystaj z Endpointów opisanych powyżej.

Konto admina - jest tylko jeden admin:
karwacki.mikolaj123@gmail.com
Qwer1234#

Po zarejestrowaniu należy potwierdżić konto linkiem wysłanym na adres email :)
Domyslnie konto tworzy się jako user

Wymagania:
ASP.NET Core 3.1 lub nowszy.
Visual Studio (lub inne środowisko obsługujące ASP.NET Core).
Uwaga: Aplikacja wymaga dostosowania konfiguracji, takiej jak połączenie z bazą danych, dostęp do serwera poczty itp. Przeczytaj kod i dostosuj go do swoich potrzeb.





Funkcje API:
ProductController:
Przeglądanie Produktów:

/api/products/view - Przeglądanie wszystkich produktów.
/api/products/view(id) - Przeglądanie konkretnego produktu po ID.
/api/products/view(category) - Przeglądanie produktów według kategorii.
Zarządzanie Produktami:

/api/products/add - Dodawanie nowych produktów (dostępne tylko dla administratorów).
/api/products/edit/{editId}/{newName}/{newDesc}/{newPrice} - Edycja istniejących produktów.
/api/products/delete/{productId} - Usuwanie produktów (dostępne tylko dla administratorów).
Zarządzanie Koszykiem:

/api/products/cart - Przeglądanie zawartości koszyka.
/api/products/addtocart/{productId} - Dodawanie produktów do koszyka.
/api/products/editcart/{productId}/{newQuantity} - Edycja ilości produktów w koszyku.
/api/products/removefromcart/{productId} - Usuwanie produktów z koszyka.
UserController:
Rejestracja i Logowanie:

/api/user/register - Rejestracja nowego użytkownika.
/api/user/login - Logowanie użytkownika.
Zarządzanie Użytkownikami:

/api/user/getall - Przeglądanie listy wszystkich użytkowników (dostępne tylko dla administratorów).
/api/user/getbyid/{id} - Przeglądanie danych konkretnego użytkownika.
/api/user/delete/{userId} - Usuwanie użytkownika (dostępne tylko dla administratorów).
/api/user/edit/{userId}/{newEmail}/{newFirstName}/{newLastName} - Edycja danych użytkownika.
Zarządzanie Sesją i Resetowanie Hasła:

/api/user/verify - Weryfikacja konta poprzez link przesłany e-mailem.
/api/user/forgot-password - Zgłaszanie zapomnianego hasła.
/api/user/reset-password - Resetowanie hasła po kliknięciu w link resetujący.
OrderController:
Składanie Zamówienia:

/api/orders/place - Składanie zamówienia na podstawie zawartości koszyka.
Historia Zamówień Dla Użytkownika:

/api/orders/userorder/{userId} - Przeglądanie historii zamówień dla konkretnego użytkownika.
