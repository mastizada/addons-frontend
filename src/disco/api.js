import config from 'config';
import { schema } from 'normalizr';

import { callApi } from 'core/api';
import { getGuid } from 'core/reducers/addons';

export const addon = new schema.Entity('addons', {}, { idAttribute: getGuid });
export const discoResult = new schema.Entity(
  'discoResults',
  { addon },
  { idAttribute: (result) => getGuid(result.addon) },
);

export function getDiscoveryAddons({ _config = config, api, taarParams = {} }) {
  const discoParamsToUse = _config.get('discoParamsToUse');
  const allowedTaarParams = Object.keys(taarParams).reduce((object, key) => {
    if (discoParamsToUse.includes(key)) {
      return { ...object, [key]: taarParams[key] };
    }

    return object;
  }, {});

  // We translate `clientId` to `'telemetry-client-id'`.
  if (allowedTaarParams.clientId) {
    allowedTaarParams['telemetry-client-id'] = allowedTaarParams.clientId;
    delete allowedTaarParams.clientId;
  }

  return callApi({
    endpoint: 'discovery',
    params: allowedTaarParams,
    schema: { results: [discoResult] },
    apiState: api,
  });
}
