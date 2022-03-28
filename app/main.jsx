import React, { useEffect, useState } from 'react';
import * as ReactDOM from 'react-dom';
import {
  Filter,
  Operators,
  TextFilter,
  NumericFilter,
  BooleanFilter,
} from '@progress/kendo-react-data-tools';
import { process, filterBy } from '@progress/kendo-data-query';
import { Grid, GridColumn } from '@progress/kendo-react-grid';
import { Label } from '@progress/kendo-react-labels';
import products from './products.json';

const operatorList = [
  {
    operator: 'gt',
    label: '>',
  },
  {
    operator: 'lt',
    label: '<',
  },
  {
    operator: 'eq',
    label: '=',
  },
  {
    operator: 'neq',
    label: '<>',
  },
  {
    operator: 'contains',
    label: 'contains',
  },
];

const initialFilter = {
  logic: 'and',
  filters: [
    {
      field: 'UnitPrice',
      operator: 'gt',
      value: 20,
    },
    {
      field: 'UnitPrice',
      operator: 'lt',
      value: 50,
    },
    {
      field: 'Discontinued',
      operator: 'eq',
      value: false,
    },
    {
      logic: 'or',
      filters: [
        {
          field: 'ProductName',
          operator: 'contains',
          value: 'organic',
        },
        {
          field: 'ProductName',
          operator: 'contains',
          value: 'cranberry',
        },
      ],
    },
  ],
};

const initialDataState = {
  filter: initialFilter,
};

const App = () => {
  let appliedFilter = '';
  const buildFilterLabel = (filter) => {
    let operand = '';
    if (filter.filters) {
      filter.filters.forEach((f) => {
        if (f.logic) {
          appliedFilter = appliedFilter + ` ${f.logic}`;
          buildFilterLabel(f);
        } else {
          if (f.field) {
            operand = operatorList.find((o) => o.operator === f.operator);
            if (
              appliedFilter.length > 0 &&
              !(
                appliedFilter.toLocaleLowerCase().endsWith('and') ||
                appliedFilter.toLowerCase().endsWith('or')
              )
            ) {
              appliedFilter += ' and';
            }
            appliedFilter =
              appliedFilter +
              ` ${f.field} ${operand ? operand.label : f.operator} ${f.value}`;
          }
        }
      });
    }
    return appliedFilter;
  };

  const [filter, setFilter] = useState(initialFilter);
  const [filterLabel, setFilterLabel] = useState(
    buildFilterLabel(initialFilter)
  );
  const [dataState, setDataState] = useState(initialDataState);

  const onFilterChange = (event) => {
    setFilter(event.filter);
    dataState.filter = event.filter;
    setDataState(dataState);
    setFilterLabel(buildFilterLabel(event.filter));
  };

  const onDataStateChange = (event) => {
    setDataState(event.dataState);
  };

  return (
    <React.Fragment>
      <Filter
        value={dataState.filter}
        onChange={onFilterChange}
        fields={[
          {
            name: 'ProductName',
            label: 'Name',
            filter: TextFilter,
            operators: Operators.text,
          },
          {
            name: 'UnitPrice',
            label: 'Price',
            filter: NumericFilter,
            operators: Operators.numeric,
          },
          {
            name: 'Discontinued',
            label: 'Discontinued',
            filter: BooleanFilter,
            operators: Operators.boolean,
          },
        ]}
      />
      <Grid
        style={{
          maxHeight: '400px',
        }}
        //data={filterBy(products, filter)}
        data={process(products, dataState)}
        {...dataState}
        onDataStateChange={onDataStateChange}
        sortable
        filterable
      >
        <GridColumn field="ProductName" title="Name" width="300px" />
        <GridColumn field="UnitPrice" title="Price" />
        <GridColumn field="Discontinued" title="Discontinued" />
      </Grid>
      <Label style={{ fontSize: '.8rem' }}>{filterLabel}</Label>
    </React.Fragment>
  );
};

ReactDOM.render(<App />, document.querySelector('my-app'));
