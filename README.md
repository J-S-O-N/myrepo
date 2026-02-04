# 💳 BankApp - Full-Stack Banking Application

A modern, full-stack banking application built with React, Node.js, and deployed on AWS with enterprise-grade CI/CD pipelines.

## ✨ Features

- 🔐 **Secure Authentication** - JWT-based authentication with bcrypt password hashing
- 💰 **Account Management** - Multiple account types with transaction history
- 📊 **Investment Tracking** - Portfolio management and performance analytics
- 🎯 **Financial Goals** - Set and track savings goals with visual progress
- ₿ **Cryptocurrency Trading** - Real-time crypto prices with multi-currency support (ZAR, USD, EUR, GBP, BTC)
- 📈 **Stock Performance** - Live JSE banking stock data from Yahoo Finance
- 🛒 **Buy Hub** - Marketplace integration
- ❤️ **Health & Fitness** - Wellness tracking
- ⚙️ **User Settings** - Personalized configuration per user

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- React 18.3.1 with Hooks
- Vite (Fast build tool)
- CSS3 with responsive design
- Multi-currency conversion system

**Backend:**
- Node.js 18.x with Express.js
- PostgreSQL 14+ (Development & Production)
- Sequelize ORM
- JWT authentication with bcryptjs

**External APIs:**
- Yahoo Finance API (JSE stock data)
- CoinGecko API (Cryptocurrency data)

**AWS Infrastructure:**
- ECS Fargate (Serverless containers)
- RDS PostgreSQL (Multi-AZ)
- Application Load Balancer
- CloudFront CDN
- S3 (Frontend hosting)
- Secrets Manager
- CloudWatch (Monitoring)

### Project Structure

```
myrepo/
├── TestAiApp/                    # Main application directory
│   ├── src/                      # Frontend React application
│   │   ├── components/          # React components
│   │   ├── App.jsx              # Main application router
│   │   └── main.jsx             # Entry point
│   ├── server/                  # Backend Express server
│   │   ├── index.cjs            # Server entry point
│   │   ├── config/              # Database & auth config
│   │   ├── models/              # Sequelize models
│   │   ├── middleware/          # JWT middleware
│   │   └── routes/              # API routes
│   └── package.json
│
├── terraform/                    # Infrastructure as Code
│   ├── main.tf                  # Root Terraform configuration
│   └── modules/                 # Reusable Terraform modules
│       ├── vpc/                 # VPC with subnets
│       ├── ecr/                 # Container registry
│       ├── ecs/                 # ECS Fargate service
│       ├── rds/                 # PostgreSQL database
│       ├── alb/                 # Load balancer
│       ├── s3/                  # Frontend hosting
│       └── cloudfront/          # CDN distribution
│
├── .github/workflows/           # CI/CD pipelines
│   ├── deploy-dev.yml           # Development deployment
│   ├── deploy-staging.yml       # Staging deployment
│   └── deploy-prod.yml          # Production deployment
│
├── docs/                        # Documentation
│   ├── AWS_ARCHITECTURE.md      # AWS infrastructure details
│   ├── DEPLOYMENT_GUIDE.md      # Deployment instructions
│   └── AWS_SETUP_SUMMARY.md     # Quick start guide
│
├── Dockerfile                   # Multi-stage Docker build
└── .dockerignore                # Docker build exclusions
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- PostgreSQL 14+ (for both development and production)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Jonathan-Singh/myrepo.git
   cd myrepo/TestAiApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp ../.env.development.template .env
   # Edit .env with your configuration
   ```

4. **Start the backend server**
   ```bash
   node server/index.cjs
   # Server runs on http://localhost:3001
   ```

5. **Start the frontend dev server** (in a new terminal)
   ```bash
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

6. **Access the application**
   - Open http://localhost:5173 in your browser
   - Register a new account or use test credentials

## 🌐 AWS Deployment

### Environment Overview

| Environment | Purpose | Auto-Deploy | Cost/Month |
|-------------|---------|-------------|------------|
| **Development** | Developer testing | ✅ Yes (on push to `develop`) | ~$90 |
| **Staging** | QA and pre-production | ⚠️ Requires approval | ~$160 |
| **Production** | Live application | ⚠️ Requires approval | ~$580 |

### Quick Deploy to AWS

1. **Review the AWS Setup Guide**
   - [AWS Architecture Overview](./docs/AWS_ARCHITECTURE.md) - Full infrastructure design
   - [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md) - Step-by-step deployment
   - [Quick Start Summary](./docs/AWS_SETUP_SUMMARY.md) - 15-minute setup

2. **Configure AWS CLI**
   ```bash
   aws configure
   # Enter your AWS credentials
   ```

3. **Deploy infrastructure with Terraform**
   ```bash
   cd terraform
   terraform init
   terraform workspace new dev
   terraform apply -var="environment=dev" -auto-approve
   ```

4. **Configure GitHub Secrets**
   - Navigate to repository Settings → Secrets and variables → Actions
   - Add AWS credentials for each environment
   - Set up environment protection rules

5. **Trigger deployment**
   ```bash
   # Development (auto-deploy)
   git push origin develop

   # Staging (requires approval)
   git push origin staging

   # Production (requires approval + creates backup)
   git tag v1.0.0
   git push origin v1.0.0
   ```

### CI/CD Pipeline Features

- ✅ Automated testing (unit, integration, e2e)
- ✅ Security scanning with Trivy
- ✅ Docker image building and ECR push
- ✅ ECS service deployment with health checks
- ✅ Frontend deployment to S3/CloudFront
- ✅ Blue/green deployment for production
- ✅ Automated rollback on failure
- ✅ Database backup before production deploy
- ✅ Smoke tests after deployment

## 📊 Key Features Details

### Multi-Currency Crypto Trading
- Real-time cryptocurrency prices via CoinGecko API
- Support for 20+ cryptocurrencies (BTC, ETH, USDT, BNB, SOL, etc.)
- Multi-currency conversion (ZAR, USD, EUR, GBP, BTC)
- Grid and list view modes
- Market statistics and Bitcoin dominance
- 24-hour change tracking

### Live JSE Stock Performance
- Real-time JSE banking stock data via Yahoo Finance API
- Tracks 5 major banks: SBK, FSR, NED, CPI, ABG
- Live price updates with refresh capability
- Detailed metrics: P/E ratio, dividend yield, volume, market cap
- Card and table view modes
- Timeframe selector (1D, 1W, 1M, 1Y)

### Financial Goals System
- Create custom savings goals with categories
- Visual progress tracking with progress bars
- Save money to goals functionality
- Goal status management (active, completed, paused)
- Per-user goal isolation
- Target amount and date tracking

### Secure User Settings
- Per-user settings isolation
- Address information management
- Transaction limits configuration
- Card settings (contactless, online payments, international)
- JWT-based authentication for all operations

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ bcrypt password hashing (12 rounds in production)
- ✅ Per-user data isolation
- ✅ AWS Secrets Manager for sensitive data
- ✅ SQL injection prevention via Sequelize ORM
- ✅ HTTPS/TLS encryption in transit
- ✅ RDS encryption at rest
- ✅ Rate limiting on API endpoints
- ✅ WAF protection (production)
- ✅ Security group network isolation
- ✅ Container vulnerability scanning

## 📈 Monitoring & Observability

- **CloudWatch Logs**: Application and container logs
- **CloudWatch Metrics**: CPU, memory, request counts
- **CloudWatch Alarms**: Critical and warning alerts
- **Health Checks**: ECS task and ALB health monitoring
- **VPC Flow Logs**: Network traffic analysis (production)
- **CloudTrail**: API audit logging

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Run linter
npm run lint
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Goals Endpoints (JWT Required)
- `GET /api/goals` - Get user's goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Settings Endpoints (JWT Required)
- `GET /api/settings` - Get user settings
- `PUT /api/settings` - Update settings
- `POST /api/settings/initialize` - Initialize default settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Authors

- **Jonathan Singh** - Initial work

## 🙏 Acknowledgments

- Yahoo Finance API for stock market data
- CoinGecko API for cryptocurrency data
- AWS for cloud infrastructure
- React and Node.js communities

## 📞 Support

For questions or issues:
- Create an issue in the GitHub repository
- Review the [Deployment Guide](./docs/DEPLOYMENT_GUIDE.md)
- Check the [AWS Architecture](./docs/AWS_ARCHITECTURE.md)

---

**Built with ❤️ using React, Node.js, and AWS**
