#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
#EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["RaspWebSite/RaspWebSite.csproj", "RaspWebSite/"]
RUN dotnet restore "RaspWebSite/RaspWebSite.csproj"
COPY . .
WORKDIR "/src/RaspWebSite"
RUN dotnet build "RaspWebSite.csproj" -c Release -o /app/build
# Install Node.JS
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs

FROM build AS publish
RUN dotnet publish "RaspWebSite.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "RaspWebSite.dll"]