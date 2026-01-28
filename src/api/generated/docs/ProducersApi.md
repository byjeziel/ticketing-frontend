# ProducersApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**producersControllerCreate**](#producerscontrollercreate) | **POST** /producers | Create a new producer|
|[**producersControllerFindAll**](#producerscontrollerfindall) | **GET** /producers | Get producers|
|[**producersControllerFindOne**](#producerscontrollerfindone) | **GET** /producers/{id} | Find producer|
|[**producersControllerRemove**](#producerscontrollerremove) | **DELETE** /producers/{id} | Remove producer|
|[**producersControllerUpdate**](#producerscontrollerupdate) | **PATCH** /producers/{id} | Update producer|

# **producersControllerCreate**
> producersControllerCreate(createProducerDto)


### Example

```typescript
import {
    ProducersApi,
    Configuration,
    CreateProducerDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProducersApi(configuration);

let createProducerDto: CreateProducerDto; //

const { status, data } = await apiInstance.producersControllerCreate(
    createProducerDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **createProducerDto** | **CreateProducerDto**|  | |


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
|**201** | Producer Created. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **producersControllerFindAll**
> producersControllerFindAll()


### Example

```typescript
import {
    ProducersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProducersApi(configuration);

const { status, data } = await apiInstance.producersControllerFindAll();
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
|**200** | List of producers. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **producersControllerFindOne**
> producersControllerFindOne()


### Example

```typescript
import {
    ProducersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProducersApi(configuration);

let id: string; //Producer ID (default to undefined)

const { status, data } = await apiInstance.producersControllerFindOne(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Producer ID | defaults to undefined|


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
|**200** | Producer finded. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **producersControllerRemove**
> producersControllerRemove()


### Example

```typescript
import {
    ProducersApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProducersApi(configuration);

let id: string; //Producer ID (default to undefined)

const { status, data } = await apiInstance.producersControllerRemove(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**string**] | Producer ID | defaults to undefined|


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
|**200** | Producer deleted. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **producersControllerUpdate**
> producersControllerUpdate(updateProducerDto)


### Example

```typescript
import {
    ProducersApi,
    Configuration,
    UpdateProducerDto
} from './api';

const configuration = new Configuration();
const apiInstance = new ProducersApi(configuration);

let id: string; //Producer ID (default to undefined)
let updateProducerDto: UpdateProducerDto; //

const { status, data } = await apiInstance.producersControllerUpdate(
    id,
    updateProducerDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **updateProducerDto** | **UpdateProducerDto**|  | |
| **id** | [**string**] | Producer ID | defaults to undefined|


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
|**200** | Producer updated. |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

