import * as React from "react";
import { SortByDirection } from "@patternfly/react-table";
import * as _ from "lodash";
import { useSearchParams } from "react-router-dom-v5-compat";
import { K8sResourceCommon } from "@openshift-console/dynamic-plugin-sdk";
import { ResourceDataViewColumn } from "./types";

export const useResourceDataViewSort = <
  TData extends K8sResourceCommon = K8sResourceCommon
>({
  columns,
  sortColumnIndex,
  sortDirection,
}: {
  columns: ResourceDataViewColumn<TData>[];
  sortColumnIndex?: number;
  sortDirection?: SortByDirection;
}) => {
  const [sortBy, setSortBy] = React.useState<{
    index: number;
    direction: SortByDirection;
  }>({
    index: sortColumnIndex ?? 0,
    direction: sortDirection ?? SortByDirection.asc,
  });
  const [searchParams, setSearchParams] = useSearchParams();

  const applySort = React.useCallback(
    (index: number, direction: SortByDirection) => {
      const sortColumn = columns[index];

      if (sortColumn) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          newParams.set("sortBy", sortColumn.title);
          newParams.set("orderBy", direction);
          return newParams;
        });
        setSortBy({ index, direction });
      }
    },
    [columns, setSearchParams]
  );

  React.useEffect(() => {
    const columnIndex = _.findIndex(columns, {
      title: searchParams.get("sortBy"),
    });

    if (!Number.isNaN(columnIndex) && columns[columnIndex]) {
      const sortOrder =
        searchParams.get("sortBy") === SortByDirection.desc.valueOf()
          ? SortByDirection.desc
          : SortByDirection.asc;

      console.log("==> sortOrder", sortOrder);

      setSortBy({ index: columnIndex, direction: sortOrder });
    }
  }, [columns, searchParams]);

  const onSort = React.useCallback(
    (
      event: React.BaseSyntheticEvent,
      index: number,
      direction: SortByDirection
    ) => {
      event.preventDefault();
      applySort(index, direction);
    },
    [applySort]
  );

  return { sortBy, onSort };
};
