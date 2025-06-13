# SoundRights Design System

## Design Principles

### Color Palette
**Primary**: Deep Purple (#6B46C1) - Professional, tech-forward
**Secondary**: Electric Blue (#3B82F6) - Innovation, trust
**Accent**: Emerald Green (#10B981) - Success, verification
**Warning**: Amber (#F59E0B) - Caution, processing
**Error**: Red (#EF4444) - Errors, alerts
**Neutral**: Gray scale (#F8FAFC to #1E293B)

### Typography
**Headings**: font-bold, text-2xl to text-4xl
**Body**: font-medium, text-base
**Captions**: font-normal, text-sm
**Code/Tech**: font-mono

### Layout Structure
**Header**: Fixed navigation with logo, main nav, and auth
**Main Content**: max-w-6xl mx-auto px-4 py-8
**Sections**: space-y-8 for vertical rhythm
**Cards**: bg-white dark:bg-gray-800 rounded-lg shadow-sm border

### Component Patterns
**Buttons**: 
- Primary: bg-purple-600 hover:bg-purple-700
- Secondary: bg-blue-600 hover:bg-blue-700
- Success: bg-emerald-600 hover:bg-emerald-700

**Status Indicators**:
- Processing: amber pulse animation
- Success: emerald with checkmark
- Error: red with X icon
- Info: blue with info icon

**Cards**:
- White background with subtle shadow
- Rounded corners (rounded-lg)
- Consistent padding (p-6)
- Border for definition

**Spacing**:
- Section gaps: space-y-8
- Element gaps: space-y-4
- Button groups: space-x-4
- Grid gaps: gap-6

### Interactive Elements
**Hover States**: Subtle scale and shadow changes
**Focus States**: Purple ring for accessibility
**Loading States**: Pulse animations with branded colors
**Transitions**: duration-200 ease-in-out

### Responsive Design
**Mobile First**: Base styles for mobile
**Breakpoints**: sm:, md:, lg:, xl: for larger screens
**Grid**: Responsive grid system (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

### Dark Mode Support
**Root Variables**: CSS custom properties
**Class Toggle**: dark: prefix for all elements
**Consistent Contrast**: Proper contrast ratios maintained

## Page-Specific Guidelines

### Navigation
- Fixed header with brand consistency
- Clear active state indicators
- Mobile-responsive hamburger menu
- Consistent styling across all pages

### Landing Page
- Hero section with clear value proposition
- Feature highlights with consistent card design
- Call-to-action buttons using primary colors
- Progressive disclosure of information

### Live Demo
- Dramatic progress visualization
- Consistent status indicators
- Real-time feedback using branded colors
- Step-by-step visual progression

### Marketplace
- Clean product grid layout
- Consistent card design for tracks
- Filter and search with branded styling
- Clear pricing and licensing information

### Analytics
- Dashboard layout with consistent metrics cards
- Chart colors matching brand palette
- Clear data visualization hierarchy
- Responsive grid for different screen sizes

### Admin
- Clean table layouts
- Consistent form styling
- Action buttons with proper hierarchy
- Status indicators for system health

## Implementation Rules

1. **Consistency**: Every page must use the same design tokens
2. **Accessibility**: Proper contrast ratios and focus states
3. **Responsiveness**: Mobile-first design approach
4. **Performance**: Optimized images and efficient CSS
5. **Maintainability**: Reusable component patterns