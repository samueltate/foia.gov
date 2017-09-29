import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Dispatcher } from 'flux';
import { Container } from 'flux/utils';

import { RequestActions } from 'actions';
import FOIARequestForm from 'components/foia_request_form';
import settings from 'settings';
import AgencyComponentStore from 'stores/agency_component';
import Api from 'util/api';

const api = new Api(settings.api.baseURL);
const jsonapi = new Api(settings.api.jsonApiBaseURL);


const dispatcher = new Dispatcher();
const agencyComponentStore = new AgencyComponentStore(dispatcher);

const requestActions = RequestActions({ dispatcher, api, jsonapi });


class FOIARequestFormApp extends Component {
  static getStores() {
    return [agencyComponentStore];
  }

  static calculateState() {
    const { agency, selectedAgency } = agencyComponentStore.getState();
    return {
      agency,
      selectedAgency,
    };
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const agencyComponentId = this.props.match.params.agency;

    // Check agency exists in store
    const { agency } = agencyComponentStore.getState();
    if (!agency) {
      requestActions.fetchAgency(agencyComponentId)
        .then(requestActions.receiveAgency);
    }
  }

  render() {
    return this.state.agency && <FOIARequestForm agency={this.state.agency} />;
  }
}

FOIARequestFormApp.propTypes = {
  match: PropTypes.object.isRequired,
};

export default Container.create(FOIARequestFormApp);
