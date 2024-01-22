<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
 
</head>

<body>

  <h1>LagasinAPI - Krótki Opis</h1>

  <p>LagasinAPI to prosty system e-commerce API, stworzony w środowisku ASP.NET Core, obsługujący podstawowe operacje związane z produktami, użytkownikami i zamówieniami.</p>

  <h2>Jak zacząć:</h2>

  <ol>
    <li>Pobierz repozytorium w formacie ZIP i rozpakuj</li>
    <li>Uruchom projekt w środowisku ASP.NET Core.</li>
    <li>Dostosuj konfigurację, taką jak połączenie z bazą danych w pliku <code>Data/ApplicationDbContext.cs</code>. Przykład: connectionString = "Data Source=TU DAJESZ SWÓJ SERVER;Initial Catalog=bazaLagasin;Integrated Security=True";</li>
    <li>Za pomocą SQL SERVER MANAGMENT STUDIO importujesz baze która znajduje się w folderze Data/bazaLagasin.bacpac.( UWAGA jest to przykładowa baza która posiada admina, jeśli stworzyć swoją bazę za pomocą add-migarion i update-database należy przełączyć w pliku <code>lunchSettings.json</code> zawartoś lunchURL na swagger i utworzyć konto administratora.)</li>
    <li>Należy zobaczyć czy pakiety nuget działają poprawnie.</li>
    <li>Teraz możesz uruchomić projekt.(jeśli połączenie z bazą nie działa spróbuj dodać migracje i zaktualizować bazę :) )</li>
    <li>Sprawdź dokumentację API w kodzie lub korzystaj z Endpointów opisanych poniżej.</li>
  </ol>

  <h3>Wymagania:</h3>

  <ul>
    <li>ASP.NET Core 3.1 lub nowszy.</li>
    <li>Visual Studio (lub inne środowisko obsługujące ASP.NET Core).</li>
  </ul>

  <p>Uwaga: Aplikacja wymaga dostosowania konfiguracji, takiej jak połączenie z bazą danych, dostęp do serwera poczty itp. Przeczytaj kod i dostosuj go do swoich potrzeb.</p>

  <h2>Zaloguj się jako administrator:</h2>

<p>Konto admina - jest tylko jeden admin:</p>

<ul>
  <li>E-mail: <code>admin@admin.pl</code></li>
  <li>Hasło: <code>Qwer1234#</code></li>
</ul>

<h2>Zarejestruj nowe konto:</h2>

<p>Utworzony user</p>
<ul>
  <li>E-mail: <code>user@user.pl</code></li>
  <li>Hasło: <code>string1234</code></li>
</ul>

<p>Po zarejestrowaniu należy potwierdzić konto linkiem wysłanym na adres email :)</p>

<p>Domyślnie konto tworzy się jako użytkownik.</p>

  <h2>Funkcje API:</h2>

  <h3>ProductController:</h3>

  <p><strong>Przeglądanie Produktów:</strong></p>

  <ul>
    <li><code>/api/products/view</code> - Przeglądanie wszystkich produktów.</li>
    <li><code>/api/products/view(id)</code> - Przeglądanie konkretnego produktu po ID.</li>
    <li><code>/api/products/view(category)</code> - Przeglądanie produktów według kategorii.</li>
  </ul>

  <p><strong>Zarządzanie Produktami:</strong></p>

  <ul>
    <li><code>/api/products/add</code> - Dodawanie nowych produktów (dostępne tylko dla administratorów).</li>
    <li><code>/api/products/edit/{editId}/{newName}/{newDesc}/{newPrice}</code> - Edycja istniejących produktów.</li>
    <li><code>/api/products/delete/{productId}</code> - Usuwanie produktów (dostępne tylko dla administratorów).</li>
  </ul>

<h3>UserController:</h3>

<p><strong>Rejestracja i Logowanie:</strong></p>

<ul>
  <li><code>/api/user/register</code> - Rejestracja nowego użytkownika.</li>
  <li><code>/api/user/login</code> - Logowanie użytkownika.</li>
</ul>

<p><strong>Zarządzanie Użytkownikami:</strong></p>

<ul>
  <li><code>/api/user/getall</code> - Przeglądanie listy wszystkich użytkowników (dostępne tylko dla administratorów).</li>
  <li><code>/api/user/getbyid/{id}</code> - Przeglądanie danych konkretnego użytkownika.</li>
  <li><code>/api/user/delete/{userId}</code> - Usuwanie użytkownika (dostępne tylko dla administratorów).</li>
  <li><code>/api/user/edit/{userId}/{newEmail}/{newFirstName}/{newLastName}</code> - Edycja danych użytkownika.</li>
</ul>

<p><strong>Zarządzanie Sesją i Resetowanie Hasła:</strong></p>

<ul>
  <li><code>/api/user/verify</code> - Weryfikacja konta poprzez link przesłany e-mailem.</li>
  <li><code>/api/user/forgot-password</code> - Zgłaszanie zapomnianego hasła.</li>
  <li><code>/api/user/reset-password</code> - Resetowanie hasła po kliknięciu w link resetujący.</li>
</ul>

<h3>OrderController:</h3>

<p><strong>Składanie Zamówienia:</strong></p>

<ul>
  <li><code>/api/orders/place</code> - Składanie zamówienia na podstawie zawartości koszyka.</li>
</ul>

<p><strong>Historia Zamówień Dla Użytkownika:</strong></p>

<ul>
  <li><code>/api/orders/userorder/{userId}</code> - Przeglądanie historii zamówień dla konkretnego użytkownika.</li>
</ul>


</body>

</html>
