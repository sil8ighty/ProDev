# ProDev Tracker Examples

This document provides practical examples of using ProDev Tracker for different types of products.

## Example 1: Software Product - Mobile Fitness App

### Step 1: Initialize Project

```bash
prodev init "FitTrack Pro" --type software
```

### Step 2: Define PRD

```bash
# Core product definition
prodev prd set what "A mobile fitness app with AI-powered personalized workout plans and nutrition tracking"
prodev prd set why "Most fitness apps use generic plans that don't adapt to individual progress and lifestyle"
prodev prd set who "Health-conscious professionals aged 25-45 who want effective, time-efficient workouts"
prodev prd set where "iOS and Android mobile devices, with optional web dashboard"
prodev prd set when "MVP launch in Q1 2025, full feature set by Q3 2025"

# Market information
prodev prd market --audience "Busy professionals seeking personalized fitness"
prodev prd market --size "200M potential users globally, $50B fitness app market"
prodev prd market --uvp "Only app that uses AI to adapt workouts in real-time based on user feedback and biometrics"
prodev prd market --competitor "MyFitnessPal"
prodev prd market --competitor "Strava"
prodev prd market --competitor "Nike Training Club"

# Business model
prodev prd business --revenue "Freemium with premium subscription at $14.99/month"
prodev prd business --projected "$5M ARR by end of year 2"
prodev prd business --cost "$800K development + $200K/year operations"
prodev prd business --roi "Projected 300% ROI by year 3"
```

### Step 3: Define MVP Milestones

```bash
# Core MVP features
prodev milestone add "User Authentication & Onboarding" \
  --mvp \
  --target 2024-12-15 \
  --description "Secure signup/login with health profile setup" \
  --deliverable "OAuth integration" \
  --deliverable "Onboarding flow" \
  --deliverable "User profile database"

prodev milestone add "AI Workout Generator" \
  --mvp \
  --target 2025-01-15 \
  --description "Core AI engine for personalized workout generation" \
  --deliverable "ML model trained" \
  --deliverable "Recommendation engine" \
  --deliverable "Exercise database"

prodev milestone add "Workout Tracking Interface" \
  --mvp \
  --target 2025-01-31 \
  --description "UI for tracking workouts in real-time" \
  --deliverable "Exercise logging screen" \
  --deliverable "Timer and rest intervals" \
  --deliverable "Progress indicators"

prodev milestone add "Basic Analytics Dashboard" \
  --mvp \
  --target 2025-02-15 \
  --description "Show user progress and trends" \
  --deliverable "Charts and graphs" \
  --deliverable "Weekly summaries" \
  --deliverable "Achievement badges"

# Post-MVP features
prodev milestone add "Nutrition Tracking" \
  --target 2025-03-15 \
  --description "Food logging and macro tracking"

prodev milestone add "Social Features" \
  --target 2025-04-01 \
  --description "Friend connections, challenges, and leaderboards"

prodev milestone add "Wearable Integration" \
  --target 2025-04-15 \
  --description "Connect with Apple Watch, Fitbit, etc."
```

### Step 4: During Development

```bash
# Update milestone progress
prodev milestone update "User Authentication & Onboarding" --status in-progress --progress 75

# Document learnings
prodev learning add "React Native Performance" \
  --content "Discovered FlatList virtualization reduces memory by 60% for exercise lists" \
  --type technique \
  --tag react-native

prodev learning add "AI Model Training Challenge" \
  --content "Initial model overfitted to our test data. Expanded training set from 500 to 5000 users" \
  --type pivot \
  --tag machine-learning

prodev learning add "User Onboarding Success" \
  --content "Adding video tutorial in onboarding increased completion rate from 60% to 85%" \
  --type success \
  --tag ux

# Add notes
prodev note add "Need to investigate Firebase vs AWS Amplify for backend" --tag research
prodev note add "Designer created new icon set in Figma - link: figma.com/..." --tag design
prodev note add "Beta users reporting slow load on Android 11" --tag bug
```

### Step 5: Generate Presentations

```bash
# Investor pitch deck (Layer 1 only)
prodev export deck --type on-demand --layer1 --format html --output investor-pitch-q1

# Technical handoff for contractors
prodev export deck --layer2 --format markdown --output tech-spec

# Complete project review
prodev export deck --layer1 --layer2 --layer3 --format html --output complete-review
```

## Example 2: Hardware Product - Smart Thermostat

### Initialize

```bash
prodev init "EcoTemp Smart Thermostat" --type hardware
```

### Define PRD

```bash
prodev prd set what "AI-powered smart thermostat with room-level sensors and predictive HVAC optimization"
prodev prd set why "Current thermostats only measure temperature at one point, leading to uneven heating/cooling and energy waste"
prodev prd set who "Homeowners and property managers interested in energy efficiency"
prodev prd set where "Residential and commercial buildings with central HVAC systems"
prodev prd set when "Prototype in 6 months, production ready in 12 months"

prodev prd market --audience "Energy-conscious homeowners"
prodev prd market --size "$15B smart home market, growing 25% annually"
prodev prd market --uvp "Only thermostat with distributed room sensors and predictive AI"
prodev prd market --competitor "Nest"
prodev prd market --competitor "Ecobee"

prodev prd business --revenue "Direct sales at $299 per unit + $4.99/month cloud subscription"
prodev prd business --projected "$10M revenue year 1"
prodev prd business --cost "$2M development + manufacturing setup"
```

### Define Hardware-Specific Milestones

```bash
# MVP milestones
prodev milestone add "Hardware Design & Schematics" \
  --mvp \
  --target 2025-01-31 \
  --description "Complete circuit design and PCB layout" \
  --deliverable "Circuit schematics" \
  --deliverable "PCB layout files" \
  --deliverable "Bill of materials"

prodev milestone add "Prototype Assembly" \
  --mvp \
  --target 2025-03-15 \
  --description "Build initial working prototypes" \
  --deliverable "5 working prototypes" \
  --deliverable "Assembly documentation"

prodev milestone add "Firmware Development" \
  --mvp \
  --target 2025-03-31 \
  --description "Core firmware for sensor reading and HVAC control" \
  --deliverable "Sensor drivers" \
  --deliverable "Control algorithms" \
  --deliverable "Over-the-air update system"

prodev milestone add "Safety & Certification Testing" \
  --mvp \
  --target 2025-05-15 \
  --description "UL and FCC certification" \
  --deliverable "Test reports" \
  --deliverable "Certification documents"

prodev milestone add "Manufacturing Partner Setup" \
  --mvp \
  --target 2025-06-30 \
  --description "Establish production line" \
  --deliverable "Manufacturing contract" \
  --deliverable "Quality control procedures"
```

### Document Hardware Learnings

```bash
prodev learning add "Temperature Sensor Calibration" \
  --content "Required individual calibration for each sensor to achieve ±0.5°C accuracy" \
  --type insight \
  --tag hardware

prodev learning add "PCB Layout Issue" \
  --content "Initial design had EM interference between WiFi and temp sensors. Redesigned with better grounding" \
  --type failure \
  --tag pcb-design

prodev learning add "Battery Backup Success" \
  --content "Added supercapacitor backup allows device to retain settings during power outages" \
  --type success \
  --tag power-management

prodev note add "Supplier lead time for main MCU is 16 weeks - need to plan ahead" --tag supply-chain
prodev note add "Testing shows device draws 2.3W average - better than 3W target" --tag power
```

## Example 3: Non-Tangible Product - Online Course

### Initialize

```bash
prodev init "Advanced TypeScript Masterclass" --type non-tangible
```

### Define PRD

```bash
prodev prd set what "Comprehensive online course teaching advanced TypeScript patterns and best practices"
prodev prd set why "Most TypeScript courses only cover basics; professionals need advanced techniques"
prodev prd set who "Mid to senior-level developers looking to master TypeScript"
prodev prd set where "Online learning platform (Teachable or custom LMS)"
prodev prd set when "Launch in 4 months with 20 video lessons"

prodev prd market --audience "Professional developers with 2+ years experience"
prodev prd market --size "10M TypeScript developers worldwide"
prodev prd market --uvp "Only course covering advanced patterns like conditional types, template literals, and type-level programming"

prodev prd business --revenue "One-time purchase $199, or subscription at $29/month"
prodev prd business --projected "$100K first year with 500 students"
```

### Content Creation Milestones

```bash
# MVP content
prodev milestone add "Course Outline & Scripts" \
  --mvp \
  --target 2024-12-31 \
  --description "Complete outline and scripts for all 20 lessons" \
  --deliverable "Lesson outlines" \
  --deliverable "Video scripts" \
  --deliverable "Code examples"

prodev milestone add "Video Recording - Modules 1-3" \
  --mvp \
  --target 2025-01-31 \
  --description "Record first 10 lessons" \
  --deliverable "10 recorded videos"

prodev milestone add "Video Recording - Modules 4-5" \
  --mvp \
  --target 2025-02-28 \
  --description "Record remaining 10 lessons" \
  --deliverable "10 recorded videos"

prodev milestone add "Interactive Coding Exercises" \
  --mvp \
  --target 2025-03-15 \
  --description "Create hands-on exercises for each module" \
  --deliverable "20 CodeSandbox exercises" \
  --deliverable "Solution guides"

prodev milestone add "Course Platform Setup" \
  --mvp \
  --target 2025-03-31 \
  --description "Set up learning platform and upload content" \
  --deliverable "Platform configured" \
  --deliverable "Payment integration" \
  --deliverable "Student dashboard"
```

### Track Content Learnings

```bash
prodev learning add "Video Length Optimization" \
  --content "Data shows students engage better with 8-12 minute videos vs 20+ minute videos" \
  --type insight \
  --tag video-production

prodev learning add "Live Coding Format" \
  --content "Switched from slide-based to live coding format - student satisfaction increased 40%" \
  --type pivot \
  --tag teaching-method

prodev note add "Need to add closed captions for accessibility" --tag accessibility
prodev note add "Beta testers requesting more real-world examples" --tag feedback
```

## Example 4: Using Workflow Features

### Check Current Workflow Stage

```bash
prodev workflow show
```

Output:
```
Workflow: software Product Development Workflow
Progress: 3/8 (37%)

Steps:
✓ Define Product Requirements (PRD)
✓ Define MVP Milestones
✓ Define Additional Milestones
○ Define Technical Architecture ← CURRENT
○ Development Phase
○ Testing & Quality Assurance
○ Complete Documentation
○ Prepare Handoff Package

Suggestion: Document technical decisions
```

### Complete Workflow Steps

```bash
# Mark technical architecture as complete
prodev workflow complete "Define Technical Architecture"

# Move to development phase
prodev workflow complete "Development Phase"
```

## Example 5: Advanced Slide Deck Generation

### Time-Based Presentation

Generate a quarterly review presentation:

```bash
# First, track some time-based milestones and learnings
# Then generate a deck covering the last 3 months

prodev export deck \
  --type time-based \
  --layer1 \
  --layer2 \
  --layer3 \
  --format html \
  --output q1-review-2025
```

### Milestone-Specific Presentation

Generate a presentation for specific milestones:

```bash
# Show progress on MVP features only
prodev export deck \
  --type milestone-based \
  --layer1 \
  --layer2 \
  --format html \
  --output mvp-progress

# This will include all MVP milestones and their progress
```

### Custom On-Demand Presentation

```bash
# Generate a technical deep-dive for engineering team
prodev export deck \
  --type on-demand \
  --layer2 \
  --format markdown \
  --output engineering-review

# Generate investor update with business focus
prodev export deck \
  --type on-demand \
  --layer1 \
  --format html \
  --output investor-update-march
```

## Example 6: Managing Unexpected Moments

Unexpected moments are critical events during development:

```bash
# As you work, document unexpected events via the Application API
# These get captured in Layer 3

# Example: API integration broke
# Document this through code or CLI extension
```

For programmatic use:

```typescript
import { Application } from './core/Application';

const app = new Application();
await app.initialize();
await app.loadProject('proj-123');

// Add unexpected moment
app.addUnexpectedMoment({
  title: 'Third-party API Deprecated',
  description: 'Payment gateway deprecated their v1 API with only 30 days notice',
  impact: 'high',
  milestoneId: 'milestone-payment-integration'
});

await app.saveProject();
```

## Example 7: Complete Project Lifecycle

Here's a complete workflow from start to finish:

```bash
# 1. Initialize
prodev init "HealthSync Wearable" --type hybrid

# 2. Define PRD
prodev prd set what "Smart health monitoring wearable with companion app"
prodev prd set why "Integrate multiple health metrics in one device"
# ... (complete all PRD fields)

# 3. Set up milestones
prodev milestone add "Hardware Prototype" --mvp --target 2025-03-01
prodev milestone add "Mobile App MVP" --mvp --target 2025-03-15
prodev milestone add "Cloud Backend" --mvp --target 2025-03-01
prodev milestone add "Data Sync System" --mvp --target 2025-04-01

# 4. During development (iterative)
prodev milestone update "Hardware Prototype" --status in-progress --progress 60
prodev learning add "Battery Life Optimization" --type insight
prodev note add "Met with manufacturer - samples in 2 weeks"

# 5. Complete workflow steps
prodev workflow complete "Define Product Requirements"
prodev workflow complete "Define MVP Milestones"
# ... continue marking steps complete

# 6. Generate presentations as needed
prodev export deck --layer1 --format html --output weekly-update-jan-15
prodev export deck --type milestone-based --layer1 --layer2 --output mvp-review

# 7. Final export
prodev export project final-project-data.json

# 8. Save regularly
prodev save
```

## Tips and Best Practices

### 1. Regular Saves
Save your project frequently, especially after major updates:
```bash
prodev save
```

### 2. Detailed Milestones
Break down large features into smaller, manageable milestones:
```bash
# Instead of one big milestone
prodev milestone add "Complete App"

# Break it down
prodev milestone add "User Authentication"
prodev milestone add "Core Feature Set"
prodev milestone add "Polish & Bug Fixes"
```

### 3. Document Everything
Use learnings to capture knowledge:
```bash
# Successes
prodev learning add "Redis Caching Success" --type success

# Failures (important!)
prodev learning add "Initial Architecture Didn't Scale" --type failure

# Pivots
prodev learning add "Switched from REST to GraphQL" --type pivot
```

### 4. Use Tags Effectively
Tags help organize and find information:
```bash
prodev note add "Check GDPR requirements" --tag legal --tag compliance
prodev learning add "CSS Grid Layout" --type technique --tag frontend --tag css
```

### 5. Review Workflow Regularly
Check your workflow progress weekly:
```bash
prodev workflow show
```

This helps ensure you're not skipping important steps.

### 6. Generate Presentations Frequently
Don't wait until the end to create presentations:
```bash
# Weekly updates for team
prodev export deck --layer1 --format html --output team-update-$(date +%Y%m%d)

# Monthly investor updates
prodev export deck --layer1 --format html --output investor-$(date +%Y-%m)
```

## Programmatic Usage

You can also use ProDev Tracker programmatically:

```typescript
import { Application, ProductType, LearningCategory } from 'prodev-tracker';

async function main() {
  const app = new Application('./my-data');
  await app.initialize();

  // Create project
  const project = app.createProject('My Project', ProductType.SOFTWARE);

  // Update PRD
  app.updatePRD({
    what: 'A revolutionary product',
    why: 'Solve a major problem',
    // ... more fields
  });

  // Add milestone
  app.addMilestone({
    title: 'First Milestone',
    description: 'Build the foundation',
    targetDate: new Date('2025-06-01'),
    isMVP: true,
    deliverables: ['API', 'Database', 'Auth'],
  });

  // Add learning
  app.addLearning({
    title: 'Important Discovery',
    content: 'Learned something valuable',
    category: LearningCategory.INSIGHT,
    tags: ['technical'],
  });

  // Generate slide deck
  const deck = app.generateSlideDeck({
    type: 'on-demand',
    includeLayer1: true,
    includeLayer2: false,
    includeLayer3: false,
  });

  const markdown = app.exportSlideDeckAsMarkdown(deck);
  console.log(markdown);

  // Save
  await app.saveProject();
}

main();
```

This allows you to integrate ProDev Tracker into your existing tools and workflows.
