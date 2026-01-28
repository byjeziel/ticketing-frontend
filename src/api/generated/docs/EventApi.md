# EventApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**eventControllerCreate**](#eventcontrollercreate) | **POST** /events | Create a new event|
|[**eventControllerFindAll**](#eventcontrollerfindall) | **GET** /events | Get events|
|[**eventControllerFindOne**](#eventcontrollerfindone) | **GET** /events/{id} | Find event|
|[**eventControllerRemove**](#eventcontrollerremove) | **DELETE** /events/{id} | Remove event|
|[**eventControllerUpdate**](#eventcontrollerupdate) | **PATCH** /events/{id} | Update event|

# **eventControllerCreate**
> eventControllerCreate(createEventDto)


### Example

```typescript
import {
    EventApi,
    Configuration,
    CreateEventDto
} from './api';

const configuration = new Configuration();
const apiInstance = new EventApi(configuration);

let createEventDto: CreateEventDto; //

const { status, data } = await apiInstance.eventControllerCreate(
    createEventDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createEventDto** | **CreateEventDto**|  | |


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**201** | Event Created. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventControllerFindAll**
> eventControllerFindAll()


### Example

```typescript
import {
    EventApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventApi(configuration);

const { status, data } = await apiInstance.eventControllerFindAll();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | List of events. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventControllerFindOne**
> eventControllerFindOne()


### Example

```typescript
import {
    EventApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventApi(configuration);

let id: string; //Event ID (default to undefined)

const { status, data } = await apiInstance.eventControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Event ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event finded. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventControllerRemove**
> eventControllerRemove()


### Example

```typescript
import {
    EventApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new EventApi(configuration);

let id: string; //Event ID (default to undefined)

const { status, data } = await apiInstance.eventControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Event ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event deleted. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **eventControllerUpdate**
> eventControllerUpdate(updateEventDto)


### Example

```typescript
import {
    EventApi,
    Configuration,
    UpdateEventDto
} from './api';

const configuration = new Configuration();
const apiInstance = new EventApi(configuration);

let id: string; //Event ID (default to undefined)
let updateEventDto: UpdateEventDto; //

const { status, data } = await apiInstance.eventControllerUpdate(
    id,
    updateEventDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateEventDto** | **UpdateEventDto**|  | |
| **id** | [**string**] | Event ID | defaults to undefined|


### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | Event updated. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

