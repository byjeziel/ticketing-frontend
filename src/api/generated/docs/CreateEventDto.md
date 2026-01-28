# CreateEventDto


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | Event title | [default to undefined]
**description** | **string** | Event description | [default to undefined]
**schedule** | [**Array&lt;ScheduleItemDto&gt;**](ScheduleItemDto.md) | Event dates, times, and tickets | [default to undefined]
**producer** | **string** | ID del productor asociado | [default to undefined]

## Example

```typescript
import { CreateEventDto } from './api';

const instance: CreateEventDto = {
    title,
    description,
    schedule,
    producer,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
