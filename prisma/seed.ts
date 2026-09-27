import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with initial LLD problems...')

  // 1. Parking Lot
  const parkingLot = await prisma.problem.create({
    data: {
      title: 'Parking Lot System',
      description: 'Design a low-level parking lot system. It should support multiple floors, different types of vehicles, and automatic ticket generation.',
      difficulty: 'Medium',
      requirements: {
        create: [
          { text: 'The parking lot has multiple floors.' },
          { text: 'Supports multiple vehicle types: Motorcycle, Car, and Truck.' },
          { text: 'Tickets are generated at entry and paid at exit.' },
          { text: 'Must allocate the nearest available spot based on the vehicle type.' },
          { text: 'Display board showing available spots per floor.' }
        ]
      },
      rubrics: {
        create: {
          criteria: {
            create: [
              { dimension: 'Requirement Understanding', description: 'Did they cover multiple floors, vehicle types, ticketing, and allocation?', maxScore: 10 },
              { dimension: 'Class Responsibilities', description: 'Are the core entities (Vehicle, Spot, Ticket, Lot) defined with appropriate responsibilities?', maxScore: 10 },
              { dimension: 'Coupling / Cohesion', description: 'Is the parking strategy decoupled from the physical lot structure?', maxScore: 10 },
              { dimension: 'Extensibility', description: 'Can a new vehicle type or pricing model be added easily?', maxScore: 10 },
              { dimension: 'Edge Cases / Testability', description: 'What happens when the lot is full? What about concurrent entries?', maxScore: 10 }
            ]
          }
        }
      }
    }
  })
  console.log('Created Problem: Parking Lot System')

  // 2. Vending Machine
  const vendingMachine = await prisma.problem.create({
    data: {
      title: 'Vending Machine',
      description: 'Design a vending machine that dispenses products when the correct amount is inserted. It should support various states like accepting money, selecting product, and dispensing.',
      difficulty: 'Medium',
      requirements: {
        create: [
          { text: 'Supports different types of products (Snacks, Beverages).' },
          { text: 'Accepts coins and bills.' },
          { text: 'Returns change if necessary.' },
          { text: 'Manages inventory and alerts if a product is out of stock.' },
          { text: 'Handles cancelled transactions (returns money).' }
        ]
      },
      rubrics: {
        create: {
          criteria: {
            create: [
              { dimension: 'Appropriate Design Patterns', description: 'Is the State pattern used to handle machine states?', maxScore: 10 },
              { dimension: 'Requirement Understanding', description: 'Are currency handling, inventory, and dispensing covered?', maxScore: 10 },
              { dimension: 'Encapsulation', description: 'Is money and inventory state protected from outside interference?', maxScore: 10 },
              { dimension: 'Edge Cases / Testability', description: 'What if exact change is not available? What if an invalid coin is inserted?', maxScore: 10 }
            ]
          }
        }
      }
    }
  })
  console.log('Created Problem: Vending Machine')

  // 3. Elevator System
  const elevatorSystem = await prisma.problem.create({
    data: {
      title: 'Elevator System',
      description: 'Design an elevator system for a building with multiple elevators and multiple floors. The system should optimize wait times.',
      difficulty: 'Hard',
      requirements: {
        create: [
          { text: 'Multiple elevators in a single building.' },
          { text: 'Buttons on each floor to request an elevator (Up/Down).' },
          { text: 'Buttons inside the elevator to select a destination floor.' },
          { text: 'An algorithm to dispatch the most appropriate elevator.' },
          { text: 'Handle weight limits and emergency alarms.' }
        ]
      },
      rubrics: {
        create: {
          criteria: {
            create: [
              { dimension: 'Class Responsibilities', description: 'Elevator, Button, Dispatcher, Floor classes clearly defined?', maxScore: 10 },
              { dimension: 'Interfaces / Abstraction', description: 'Is the dispatching algorithm abstracted so it can be swapped?', maxScore: 10 },
              { dimension: 'Requirement Understanding', description: 'Internal vs external requests handled correctly?', maxScore: 10 },
              { dimension: 'Edge Cases / Testability', description: 'Concurrency issues with requests, weight limit handling.', maxScore: 10 }
            ]
          }
        }
      }
    }
  })
  console.log('Created Problem: Elevator System')

  // 4. Library Management
  const libraryManagement = await prisma.problem.create({
    data: {
      title: 'Library Management System',
      description: 'Design a system to manage a library’s catalog, member accounts, and book borrowing/returning.',
      difficulty: 'Easy',
      requirements: {
        create: [
          { text: 'Add, remove, and search for books by title, author, or subject.' },
          { text: 'Register members and manage their borrowing limits.' },
          { text: 'Checkout books, renew books, and return books.' },
          { text: 'Calculate fines for overdue returns.' },
          { text: 'Reserve a book if it is currently checked out.' }
        ]
      },
      rubrics: {
        create: {
          criteria: {
            create: [
              { dimension: 'Requirement Understanding', description: 'Search, checkout, reservations, fines are accounted for?', maxScore: 10 },
              { dimension: 'Class Responsibilities', description: 'Book, Member, Librarian, Catalog, Loan, Reservation classes.', maxScore: 10 },
              { dimension: 'Relationships', description: 'How do Members relate to Loans and Reservations? 1:N?', maxScore: 10 },
              { dimension: 'Edge Cases / Testability', description: 'Member exceeds limit? Book is already reserved by someone else?', maxScore: 10 }
            ]
          }
        }
      }
    }
  })
  console.log('Created Problem: Library Management System')

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
