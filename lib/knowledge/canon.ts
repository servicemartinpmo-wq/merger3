export interface Book {
  title: string;
  author: string;
  year: string;
  description: string;
  category: string;
}

export const managementCanon: Book[] = [
  // Corporate Strategy & Leadership
  { title: "Competitive Strategy", author: "Michael E. Porter", year: "1980", category: "Strategy", description: "Introduced five forces framework to analyze industry competitiveness and strategy formulation." },
  { title: "Competitive Advantage", author: "Michael E. Porter", year: "1985", category: "Strategy", description: "Explores value chain analysis and sustainable competitive advantage." },
  { title: "On Competition", author: "Michael E. Porter", year: "1998", category: "Strategy", description: "Collection of essays expanding on strategy concepts and competitive dynamics." },
  { title: "Blue Ocean Strategy", author: "W. Chan Kim & Renée Mauborgne", year: "2005", category: "Strategy", description: "Methodology for creating uncontested market space and value innovation." },
  { title: "Good Strategy Bad Strategy", author: "Richard Rumelt", year: "2011", category: "Strategy", description: "Distinguishes effective strategies from poor ones with diagnostic frameworks." },
  { title: "Playing to Win", author: "A.G. Lafley & Roger Martin", year: "2013", category: "Strategy", description: "Step-by-step guide to strategic choice cascades in organizations." },
  { title: "Understanding Michael Porter", author: "Joan Magretta", year: "2011", category: "Strategy", description: "Simplifies Porter’s concepts for practical strategic application." },
  { title: "Good to Great", author: "Jim Collins", year: "2001", category: "Leadership", description: "Factors that transform good companies into great performers." },
  { title: "Built to Last", author: "Jim Collins & Jerry Porras", year: "1994", category: "Leadership", description: "Long-lasting corporate practices for enduring success." },
  
  // Operations & Process Management
  { title: "The Goal", author: "Eliyahu M. Goldratt", year: "1984", category: "Operations", description: "Theory of Constraints and operational bottleneck management." },
  { title: "The Toyota Way", author: "Jeffrey Liker", year: "2004", category: "Operations", description: "Principles behind Toyota’s lean culture and operations." },
  { title: "Lean Thinking", author: "James P. Womack & Daniel T. Jones", year: "1996", category: "Operations", description: "Core lean principles for process improvement." },
  { title: "Out of the Crisis", author: "W. Edwards Deming", year: "1982", category: "Operations", description: "Quality management and statistical process control." },
  { title: "The Machine That Changed the World", author: "James P. Womack", year: "1990", category: "Operations", description: "The story of lean production and its impact on the world." },
  
  // Project, Program & Portfolio Management
  { title: "PMBOK Guide", author: "Project Management Institute", year: "Latest", category: "Project Management", description: "Global standard for project management practices." },
  { title: "Scrum", author: "Jeff Sutherland", year: "2014", category: "Project Management", description: "Scrum framework for iterative development." },
  { title: "The Phoenix Project", author: "Gene Kim", year: "2013", category: "Project Management", description: "DevOps and project flow improvement." },
  { title: "The Lean Startup", author: "Eric Ries", year: "2011", category: "Project Management", description: "Applies iterative project principles to product development." },
  { title: "Critical Chain", author: "Eliyahu M. Goldratt", year: "1997", category: "Project Management", description: "Applying Theory of Constraints to project management." },
  
  // Human Capital & Organization
  { title: "The Practice of Management", author: "Peter Drucker", year: "1954", category: "Management", description: "Foundation of modern management principles." },
  { title: "Drive", author: "Daniel Pink", year: "2009", category: "Psychology", description: "Motivation science applied to work." },
  { title: "The Five Dysfunctions of a Team", author: "Patrick Lencioni", year: "2002", category: "Management", description: "Organizational behavior and teamwork models." },
  { title: "Leading Change", author: "John Kotter", year: "1996", category: "Management", description: "Framework for organizational change." },
  { title: "Work Rules!", author: "Laszlo Bock", year: "2015", category: "HR", description: "Insights from Google's people operations." },
  
  // Technology & Data
  { title: "Enterprise Architecture as Strategy", author: "Jeanne W. Ross", year: "2006", category: "Technology", description: "Linking IT and business strategy." },
  { title: "Digital Transformation Playbook", author: "David Rogers", year: "2016", category: "Technology", description: "Frameworks for digital business transformation." },
  { title: "Thinking in Systems", author: "Donella Meadows", year: "2008", category: "Systems Thinking", description: "Understanding interdependencies and feedback loops." },
  { title: "The Second Machine Age", author: "Erik Brynjolfsson", year: "2014", category: "Technology", description: "Work, progress, and prosperity in a time of brilliant technologies." },
  
  // Logic, Reasoning & Decision Making
  { title: "Thinking, Fast and Slow", author: "Daniel Kahneman", year: "2011", category: "Logic", description: "Explores the two systems that drive the way we think." },
  { title: "The Pyramid Principle", author: "Barbara Minto", year: "1987", category: "Logic", description: "Logic in writing and thinking for consultants." },
  { title: "Superforecasting", author: "Philip E. Tetlock", year: "2015", category: "Logic", description: "The art and science of prediction." },
  
  // Psychology & Behavioral Science
  { title: "Influence", author: "Robert Cialdini", year: "1984", category: "Psychology", description: "The psychology of persuasion." },
  { title: "Nudge", author: "Richard Thaler & Cass Sunstein", year: "2008", category: "Psychology", description: "Improving decisions about health, wealth, and happiness." },
  
  // Science, Systems & Analytics
  { title: "The Black Swan", author: "Nassim Nicholas Taleb", year: "2007", category: "Analytics", description: "The impact of the highly improbable." },
  { title: "Signal and the Noise", author: "Nate Silver", year: "2012", category: "Analytics", description: "Why so many predictions fail—but some don't." }
];
