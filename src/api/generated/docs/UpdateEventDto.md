# UpdateEventDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | Event title | [optional] [default to undefined]
**description** | **string** | event description | [optional] [default to undefined]
**schedule** | [**Array&lt;ScheduleItemDto&gt;**](ScheduleItemDto.md) | Event dates, times, and tickets | [optional] [default to undefined]
**producer** | **string** | ID del productor asociado | [optional] [default to undefined]

## Example

```typescript
import { UpdateEventDto } from './api';

const instance: UpdateEventDto = {
    title,
    description,
    schedule,
    producer,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
