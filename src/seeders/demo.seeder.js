//backend/src/seeders/demo.seeder.js
const bcrypt = require('bcrypt');
const { User, Bus, Student } = require('../models');

const seedDemoData = async () => {
  try {
    console.log('Seeding demo data...');
    
    // Create users
    const hashedPassword = await bcrypt.hash('password', 10);
    
    // Create admin
    await User.findOrCreate({
      where: { phone: '93935555' },
      defaults: {
        name: 'Admin User',
        phone: '93935555',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        active: true
      }
    });
    
    // Create driver
    const [driver] = await User.findOrCreate({
      where: { phone: '93934444' },
      defaults: {
        name: 'Driver User',
        phone: '93934444',
        email: 'driver@example.com',
        password: hashedPassword,
        role: 'driver',
        active: true
      }
    });
    
    // Create parents
    const [parent1] = await User.findOrCreate({
      where: { phone: '93931111' },
      defaults: {
        name: 'Parent One',
        phone: '93931111',
        email: 'parent1@example.com',
        password: hashedPassword,
        role: 'parent',
        active: true
      }
    });
    
    const [parent2] = await User.findOrCreate({
      where: { phone: '93932222' },
      defaults: {
        name: 'Parent Two',
        phone: '93932222',
        email: 'parent2@example.com',
        password: hashedPassword,
        role: 'parent',
        active: true
      }
    });
    
    const [parent3] = await User.findOrCreate({
      where: { phone: '93933333' },
      defaults: {
        name: 'Parent Three',
        phone: '93933333',
        email: 'parent3@example.com',
        password: hashedPassword,
        role: 'parent',
        active: true
      }
    });
    
    // Create bus
    const [bus] = await Bus.findOrCreate({
      where: { plateNumber: 'DEMO-123' },
      defaults: {
        plateNumber: 'DEMO-123',
        capacity: 30,
        model: 'School Bus Model X',
        year: 2023,
        status: 'active',
        driverId: driver.id
      }
    });
    
    // Create students
    await Student.findOrCreate({
      where: { name: 'Student One', parentId: parent1.id },
      defaults: {
        name: 'Student One',
        grade: '5th Grade',
        homeAddress: '123 Main St',
        homeLatitude: 40.7128,
        homeLongitude: -74.0060,
        emergencyContact: parent1.phone,
        parentId: parent1.id
      }
    });
    
    await Student.findOrCreate({
      where: { name: 'Student Two', parentId: parent2.id },
      defaults: {
        name: 'Student Two',
        grade: '4th Grade',
        homeAddress: '456 Oak Ave',
        homeLatitude: 40.7129,
        homeLongitude: -74.0061,
        emergencyContact: parent2.phone,
        parentId: parent2.id
      }
    });
    
    await Student.findOrCreate({
      where: { name: 'Student Three', parentId: parent3.id },
      defaults: {
        name: 'Student Three',
        grade: '6th Grade',
        homeAddress: '789 Pine Blvd',
        homeLatitude: 40.7130,
        homeLongitude: -74.0062,
        emergencyContact: parent3.phone,
        parentId: parent3.id
      }
    });
    
    console.log('Demo data seeded successfully');
  } catch (error) {
    console.error('Error seeding demo data:', error);
  }
};

module.exports = seedDemoData;