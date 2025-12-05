# Environment Variables Setup

## Quick Start

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` and fill in your credentials:**
   - Replace `yourpassword` in `DATABASE_URL` with your MySQL password
   - Replace the JWT secrets with random strings (see below)
   - Adjust `PORT` if needed (default: 5000)

3. **Create the database:**
   ```sql
   CREATE DATABASE dinnersready;
   ```

## Database URL Format

```
mysql://username:password@host:port/database_name
```

### Common Examples:

**Local MySQL with root user:**
```env
DATABASE_URL="mysql://root:mypassword@localhost:3306/dinnersready"
```

**Local MySQL with custom user:**
```env
DATABASE_URL="mysql://dbuser:dbpass123@localhost:3306/dinnersready"
```

**Remote MySQL server:**
```env
DATABASE_URL="mysql://username:password@192.168.1.100:3306/dinnersready"
```

**MySQL with no password (not recommended):**
```env
DATABASE_URL="mysql://root@localhost:3306/dinnersready"
```

## Generating JWT Secrets

For production, generate secure random strings:

**Using OpenSSL:**
```bash
openssl rand -base64 32
```

**Using Node.js:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Then replace both `JWT_SECRET` and `JWT_REFRESH_SECRET` with different generated values.

## Important Notes

- ⚠️ **Never commit `.env` to git** - it's already in `.gitignore`
- ✅ `.env.example` is safe to commit (no real credentials)
- 🔒 Use strong, unique secrets in production
- 📝 Keep your `.env` file secure and backed up

