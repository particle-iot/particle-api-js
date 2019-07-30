# End-to-end tests for the EventStream feature
# These tests are hard to automate, especially in the browser since they involve error handling with the API
# so the tests are documented in Gerkin format and are meant to be executed manually
Feature: EventStream

  Scenario: Connect to event stream
    Given the API is running
    And the API access token is valid
    When I run the end-to-end test program
    Then the output should contain "event stream connected"

  Scenario: Receive event
    Given the event stream is connected
    When I publish a Particle event through the CLI with `particle publish test`
    Then the event "event" with data "{ name: 'test', ... }" should be output

  Scenario: Initial connection failure
    Given the API is not running
    When I run the end-to-end test program
    Then the output should contain "Error: connect ECONNREFUSED"
    And the end-to-end test program should exit

  Scenario: Invalid credentials
    Given the API is running
    And the API access token is not valid
    When I run the end-to-end test program
    Then the output should contain "The access token provided is invalid"
    And the end-to-end test program should exit

  Scenario: Initial connection timeout
    Given the API is paused (press Ctrl-Z in the API terminal)
    When I run the end-to-end test program
    Then the output should contain "Timeout"
    And the end-to-end test program should exit

  Scenario: Disconnect due to connection failure
    Given the event stream is connected
    When I stop the API (press Ctrl-C in the API terminal)
    Then the event "disconnect" should be output immediately
    And after 2 seconds, the event "reconnect" should be output
    And the event "reconnect-error" should be output immediately
    And the "reconnect" and "reconnect-error" should repeat indefinitely

  Scenario: Reconnect after connection failure
    Given the event stream is trying to reconnect after connection failure
    When I start the API
    Then the event "reconnect" followed by "reconnect-success" should be output

  Scenario: Disconnect due to idle timeout
    Given the event stream is connected
    When I pause the API (press Ctrl-Z in the API terminal)
    Then after up to 13 seconds, the event "disconnect" should be output
    And after 2 seconds, the event "reconnect" should be output
    And after 13 seconds, the event "reconnect-error" should be output
    And the "reconnect" and "reconnect-error" should repeat indefinitely

  Scenario: Reconnect after idle timeout
    Given the event stream is trying to reconnect after idle timeout
    When I unpause the API (type % in bash to resume the process)
    Then the event "reconnect-success" should be output

  Scenario: Receive event after reconnect
    Given the event stream reconnected after a connection failure
    When I publish a Particle event through the CLI with `particle publish test`
    Then the event "event" should be published once
