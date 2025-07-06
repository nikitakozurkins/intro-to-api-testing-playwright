💡**Checklist for (GET /test-orders)**

| #     | Scenario | Test case                                                                   | Test data                              |
| ----- | -------- | --------------------------------------------------------------------------- | -------------------------------------- |
| **1** | Positive | Successful get request with valid credentials should receive 200            | username = string<br>password = string |
| **2** | Negative | Invalid get request when username and password are empty should receive 500 | username = null<br>password = null     |
| **3** | Negative | Invalid get request when request header is missing should receive 500       | Empty header                           |

💡**Checklist for (DELETE /test-orders/{id})**

| #     | Scenario | Test case                                                      | Test data                                          |
| ----- | -------- | -------------------------------------------------------------- | -------------------------------------------------- |
| **1** | Positive | Successful delete request should receive 204                   | valid api_key = 1234567890123456<br>id = integer   |
| **2** | Negative | Invalid delete request with invalid api_key should receive 401 | invalid api_key = 123456789012345x<br>id = integer |
| **3** | Negative | Invalid delete request without api_key should receive 400      | Empty api_key header                               |

💡**Checklist for (PUT /test-orders/{id})**

| #     | Scenario | Test case                                                        | Test data                                                                                                                                                                         |
| ----- | -------- | ---------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1** | Positive | Successful put request with valid data should receive 200        | valid api_key = 1234567890123456<br>id = integer<br>valid body = {"status": "OPEN","courierId": 0,"customerName": "string","customerPhone": "string","comment": "string","id": 0} |
| **2** | Negative | Invalid put request without data should receive 400              | valid api_key = 1234567890123456<br>id = integer<br>without body                                                                                                                  |
| **3** | Negative | Invalid put request without api_key in header should receive 400 | id = integer<br>valid body = {"status": "OPEN","courierId": 0,"customerName": "string","customerPhone": "string","comment": "string","id": 0}<br>without api_key in header        |
