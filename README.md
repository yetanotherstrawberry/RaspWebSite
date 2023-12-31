# RaspWebSite
Portfolio webpage in Angular using .NET 7 WebAPI, SQL Server and Entity Framework. Also uses Angular Material, Bootstrap, LINQ, AutoMapper and FluentAPI.
This website uses ASP.NET Identity and JWT in order to authorize an admin.

![Portfolio](/RaspWebSite/Screenshots/Portfolio.png)


## Functionality
### Tiles
Add tile with a title, background image, link and description. All tiles will be visible in the Portfolio. You can add, edit and remove any tile.

![New tile](/RaspWebSite/Screenshots/NewTile.png)

### Tags
Add tags to be used in Portfolio tiles. You can assign multiple tags to multiple tiles. You can add, edit and remove any tag.

![New tag](/RaspWebSite/Screenshots/NewTag.png)

### Dark and light modes
This website supports both light and dark modes. Use switch at the top-right corner to switch between them. Your choice is remembered per browser.

![Visits](/RaspWebSite/Screenshots/Visits.png)

### Tracking of visits
All visitors will be tracked with their IP, last visit and the number of them stored in the database.

## Notes
### App Secrets
Please override appsettings.json by any mean (particularly using Azure App Settings). You should override "Jwt":"Key" (Jwt__Key in Azure notation) setting with any secure key and "DefaultConnection" connection string with a valid one. By default this app will use SQL Server Local Database. You can change these setting in the file, however it is not recommended due to security reasons.

### Swagger
This webpage comes with Swagger. It is enabled in debug mode. Visit /swagger/ subdirectory of the webpage in your browser to use it.

### First run
Please create the first user by using /api/users/firstrun endpoint. Check the schema in Swagger if you need. This endpoint will work only if there is no user in the database.
