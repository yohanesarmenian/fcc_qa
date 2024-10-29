const chai = require('chai');
const assert = chai.assert;

const server = require('../server');

const chaiHttp = require('chai-http');
chai.use(chaiHttp);

suite('Functional Tests', function () {
  this.timeout(5000);
  suite('Integration tests with chai-http', function () {
    // #1
    test('Test GET /hello with no name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello')
        .end(function (err, res) {
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.text, 'hello Guest', 'response should be "hello Guest"');
          done();
        });
    });
    // #2
    test('Test GET /hello with your name', function (done) {
      chai
        .request(server)
        .keepOpen()
        .get('/hello?name=xy_z')
        .end(function (err, res) {
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.text, 'hello xy_z', 'response should be "hello xy_z"');
          done();
        });
    });
    // #3
    test('Send {surname: "Colombo"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send ({surname: 'Colombo'})
        .end(function (err, res) {
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be json');
          assert.equal(res.body.name, 'Cristoforo', 'res.body.name should be "Cristoforo"');
          assert.equal(res.body.surname, 'Colombo', 'res.body.surname should be "Colombo"');
          done();
        });
    });
    // #4
    test('Send {surname: "da Verrazzano"}', function (done) {
      chai
        .request(server)
        .keepOpen()
        .put('/travellers')
        .send ({surname: 'da Verrazzano'})
        .end(function (err, res) {
          assert.equal(res.status, 200, 'response status should be 200');
          assert.equal(res.type, 'application/json', 'Response should be json');
          assert.equal(res.body.name, 'Giovanni', 'res.body.name should be "Giovanni"');
          assert.equal(res.body.surname, 'da Verrazzano', 'res.body.surname should be "da Verrazzano"');
          done();
        });
    });
  });
});

const Browser = require('zombie');
// Set the site property to your project URL
Browser.site = 'https://3000-yohanesarmenian-fccqa-exowmsz7cah.ws-us116.gitpod.io'; // Change to localhost
const browser = new Browser();
suite('Functional Tests with Zombie.js', function () {
  this.timeout(5000);
  
    // Use suiteSetup to visit the root route
  suiteSetup(function(done) {
    return browser.visit('/', done);
  });

  suite('Headless browser', function () {
    test('should have a working "site" property', function() {
      assert.isNotNull(browser.site);
    });
  });

  suite('"Famous Italian Explorers" form', function () {
    // #5
    test('Submit the surname "Colombo" in the HTML form', function (done) {
      // Fill in the surname field
      browser.fill('input[name=surname]', 'Colombo').then(() => {
        // Press the submit button
        return browser.pressButton('submit'); // Return the promise from pressButton
      }).then(() => {
        // Assertions after the form submission
        browser.assert.success(); // Check if the response status is OK (200)
        browser.assert.text('span#name', 'Cristoforo'); // Check the name
        browser.assert.text('span#surname', 'Colombo'); // Check the surname
        browser.assert.elements('span#dates', 1); // Check that there is 1 span#dates element
        done(); // Indicate that the test is complete
      }).catch(err => {
        done(err); // Handle any errors that occur during the test
      });
    });
    // #6
    test('Submit the surname "Vespucci" in the HTML form', function (done) {

      browser.fill('input[name=surname]', 'Vespucci').then(() => {
        return browser.pressButton('submit')
      }).then(() => {
        browser.assert.success(); // Check if the response status is OK (200)
        browser.assert.text('span#name', 'Amerigo'); // Check the name
        browser.assert.text('span#surname', 'Vespucci'); // Check the surname
        browser.assert.elements('span#dates', 1); // Check that there is 1 span#dates element
        done(); // Indicate that the test is complete
      }).catch(err => {
        done(err); // Handle any errors that occur during the test
      });
    });
  });
});