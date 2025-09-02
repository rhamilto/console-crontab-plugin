import React from "react";
import { CronTabKind } from "@crontab-model/types";
import {
  K8sResourceCommon,
  ListPageBody,
  ListPageCreateLink,
  ListPageHeader,
  Timestamp,
  useAccessReview,
  useK8sWatchResource,
  useLabelsModal,
} from "@openshift-console/dynamic-plugin-sdk";
import { useCronTabTranslation } from "@crontab-utils/hooks/useCronTabTranslation";
import {
  ResourceLink,
  TableColumn,
  useAnnotationsModal,
  useDeleteModal,
} from "@openshift-console/dynamic-plugin-sdk";
import {
  Dropdown,
  DropdownItem,
  DropdownList,
  MenuToggle,
  MenuToggleElement,
} from "@patternfly/react-core";
import { EllipsisVIcon } from "@patternfly/react-icons";
import { useHistory } from "react-router-dom";
import { cronTabGroupVersionKind } from "src/utils/utils";
import { CRONTAB_KIND_PLURAL } from "src/const";
import {
  KEBAB_ACTION_EDIT_ID,
  KEBAB_ACTION_EDIT_ANNOTATIONS_ID,
  KEBAB_ACTION_EDIT_LABELS_ID,
  KEBAB_ACTION_DELETE_ID,
  KEBAB_BUTTON_ID,
} from "./const";
import { ResourceDataView } from "../DataView/ResourceDataView";
import { GetDataViewRows } from "../DataView/useResourceDataViewData";

type CronTabListProps = {
  namespace: string;
  showTitle?: boolean;
};

type CronTabKebabProps = {
  obj: CronTabKind;
};

const CronTabList: React.FC<CronTabListProps> = ({
  namespace,
  showTitle = true,
}) => {
  const [cronTabs, loaded] = useK8sWatchResource<K8sResourceCommon[]>({
    isList: true,
    groupVersionKind: cronTabGroupVersionKind,
    namespaced: true,
    namespace,
  });
  const { t } = useCronTabTranslation();
  const columns = useCronTabColumns();
  const createAccessReview = {
    groupVersionKind: cronTabGroupVersionKind,
    namespace: namespace || "default",
  };

  const createURL = `/k8s/ns/${namespace || "default"}/${
    cronTabGroupVersionKind.group
  }~${cronTabGroupVersionKind.version}~${
    cronTabGroupVersionKind.kind
  }/~new/form`;

  return (
    <>
      <ListPageHeader title={showTitle ? t("CronTabs") : undefined}>
        <ListPageCreateLink
          to={createURL}
          createAccessReview={createAccessReview}
        >
          {t("Create CronTab")}
        </ListPageCreateLink>
      </ListPageHeader>
      <ListPageBody>
        <ResourceDataView
          data={cronTabs as CronTabKind[]}
          loaded={loaded}
          columns={columns}
          initialFilters={{ name: "", labels: "" }}
          getDataViewRows={getDataViewRows}
          hideColumnManagement={true}
        />
      </ListPageBody>
    </>
  );
};

const CronTabKebab: React.FC<CronTabKebabProps> = ({ obj }) => {
  const { t } = useCronTabTranslation();
  const [isOpen, setIsOpen] = React.useState(false);
  const launchDeleteModal = useDeleteModal(obj);
  const launchAnnotationsModal = useAnnotationsModal(obj);
  const launchLabelsModal = useLabelsModal(obj);
  const { name, namespace } = obj.metadata;
  const canEditCronTab = useAccessReview({
    group: cronTabGroupVersionKind.group,
    resource: CRONTAB_KIND_PLURAL,
    verb: "update",
    name,
    namespace,
  });
  const canDeleteCronTab = useAccessReview({
    group: cronTabGroupVersionKind.group,
    resource: CRONTAB_KIND_PLURAL,
    verb: "delete",
    name,
    namespace,
  });
  const history = useHistory();

  const onFocus = () => {
    const element = document.getElementById("kebab-button");
    element.focus();
  };

  const onSelect = () => {
    setIsOpen(false);
    onFocus();
  };

  const editURL = `/k8s/ns/${namespace}/${cronTabGroupVersionKind.group}~${
    cronTabGroupVersionKind.version
  }~${cronTabGroupVersionKind.kind}/${encodeURIComponent(name)}/yaml`;

  const dropdownItems = [
    <DropdownItem
      key={KEBAB_ACTION_EDIT_LABELS_ID}
      onClick={launchLabelsModal}
      isDisabled={!canEditCronTab}
      data-test-action={KEBAB_ACTION_EDIT_LABELS_ID}
    >
      {t("Edit labels")}
    </DropdownItem>,
    <DropdownItem
      key={KEBAB_ACTION_EDIT_ANNOTATIONS_ID}
      onClick={() => launchAnnotationsModal()}
      isDisabled={!canEditCronTab[0]}
      data-test-action={KEBAB_ACTION_EDIT_ANNOTATIONS_ID}
    >
      {t("Edit annotations")}
    </DropdownItem>,
    <DropdownItem
      key={KEBAB_ACTION_EDIT_ID}
      onClick={() => history.push(editURL)}
      isDisabled={!canEditCronTab[0]}
      data-test-action={KEBAB_ACTION_EDIT_ID}
    >
      {t("Edit CronTab")}
    </DropdownItem>,
    <DropdownItem
      key={KEBAB_ACTION_DELETE_ID}
      onClick={launchDeleteModal}
      isDisabled={!canDeleteCronTab[0]}
      data-test-action={KEBAB_ACTION_DELETE_ID}
    >
      {t("Delete CronTab")}
    </DropdownItem>,
  ];

  return (
    <Dropdown
      isOpen={isOpen}
      onSelect={onSelect}
      onOpenChange={(isOpen: boolean) => setIsOpen(isOpen)}
      toggle={(toggleRef: React.Ref<MenuToggleElement>) => (
        <MenuToggle
          ref={toggleRef}
          aria-label={t("Actions")}
          variant="plain"
          onClick={() => setIsOpen(!isOpen)}
          isExpanded={isOpen}
          icon={<EllipsisVIcon />}
          id={KEBAB_BUTTON_ID}
          data-test={KEBAB_BUTTON_ID}
        />
      )}
      popperProps={{ position: "right" }}
      shouldFocusToggleOnSelect
    >
      <DropdownList>{dropdownItems}</DropdownList>
    </Dropdown>
  );
};

const tableColumnInfo = [
  {
    id: "name",
  },
  { id: "namespace" },
  { id: "cronspec" },
  { id: "image" },
  { id: "replicas" },
  { id: "created" },
  { id: "actions" },
];

const getDataViewRows: GetDataViewRows<CronTabKind, undefined> = (
  data,
  columns
) => {
  return data.map(({ obj }) => {
    const { name, namespace, creationTimestamp } = obj.metadata;
    const { cronSpec, image, replicas } = obj.spec;

    const rowCells = {
      [tableColumnInfo[0].id]: {
        cell: (
          <ResourceLink
            groupVersionKind={cronTabGroupVersionKind}
            name={name}
            namespace={namespace}
          />
        ),
        props: {
          isStickyColumn: true,
          hasRightBorder: true,
        },
      },
      [tableColumnInfo[1].id]: {
        cell: <ResourceLink kind="Namespace" name={namespace} />,
      },
      [tableColumnInfo[2].id]: {
        cell: cronSpec,
      },
      [tableColumnInfo[3].id]: {
        cell: image,
      },
      [tableColumnInfo[4].id]: {
        cell: replicas,
      },
      [tableColumnInfo[5].id]: {
        cell: <Timestamp timestamp={creationTimestamp} />,
      },
      [tableColumnInfo[6].id]: {
        cell: <CronTabKebab obj={obj} />,
        props: {
          isStickyColumn: true,
          stickyMinWidth: "0",
          hasLeftBorder: true,
          isActionCell: true,
        },
      },
    };

    return columns.map(({ id }) => {
      const cell = rowCells[id]?.cell || <span>-</span>;
      return {
        id,
        props: rowCells[id]?.props,
        cell,
      };
    });
  });
};

const useCronTabColumns = () => {
  const { t } = useCronTabTranslation();
  const columns: TableColumn<CronTabKind>[] = React.useMemo(
    () => [
      {
        title: t("Name"),
        id: tableColumnInfo[0].id,
        sort: "metadata.name",
        props: {
          isStickyColumn: true,
          modifier: "nowrap",
        },
      },
      {
        title: t("Namespace"),
        id: tableColumnInfo[1].id,
        sort: "metadata.namespace",
        props: {
          modifier: "nowrap",
        },
      },
      {
        title: t("CronSpec"),
        id: tableColumnInfo[2].id,
        sort: "spec.cronSpec",
        props: {
          modifier: "nowrap",
        },
      },
      {
        title: t("Image"),
        id: tableColumnInfo[3].id,
        sort: "spec.image",
        props: {
          modifier: "nowrap",
        },
      },
      {
        title: t("Replicas"),
        id: tableColumnInfo[4].id,
        sort: "spec.replicas",
        props: {
          modifier: "nowrap",
        },
      },
      {
        title: t("Created"),
        id: tableColumnInfo[5].id,
        sort: "metadata.creationTimestamp",
        props: {
          modifier: "nowrap",
        },
      },
      {
        title: "",
        id: tableColumnInfo[6].id,
        props: {
          isStickyColumn: true,
          stickyMinWidth: "0",
          isActionCell: true,
        },
      },
    ],
    [t]
  );

  return columns;
};

export default CronTabList;
