import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import client from "../../../services/restClient";
import _ from "lodash";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Tag } from 'primereact/tag';
import moment from "moment";
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';


const getSchemaValidationErrorsStrings = (errorObj) => {
    let errMsg = {};
    for (const key in errorObj.errors) {
        if (Object.hasOwnProperty.call(errorObj.errors, key)) {
            const element = errorObj.errors[key];
            if (element?.message) {
                errMsg.push(element.message);
            }
        }
    }
    return errMsg.length ? errMsg : errorObj.message ? errorObj.message : null;
};

const EmployeeCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [id, setId] = useState([])
const [candidateId, setCandidateId] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

     useEffect(() => {
                    //on mount task
                    client
                        .service("task")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleTaskId } })
                        .then((res) => {
                            setId(res.data.map((e) => { return { name: e[''], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Task", type: "error", message: error.message || "Failed get task" });
                        });
                }, []);
 useEffect(() => {
                    //on mount candidate
                    client
                        .service("candidate")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleCandidateId } })
                        .then((res) => {
                            setCandidateId(res.data.map((e) => { return { name: e[''], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "Candidate", type: "error", message: error.message || "Failed get candidate" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            id: _entity?.id?._id,
candidateId: _entity?.candidateId?._id,
startDate: _entity?.startDate,
        };

        setLoading(true);
        try {
            
        await client.service("employee").patch(_entity._id, _data);
        const eagerResult = await client
            .service("employee")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "id",
                    service : "task",
                    select:[""]},{
                    path : "candidateId",
                    service : "candidate",
                    select:[""]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info employee updated successfully" });
        props.onEditResult(eagerResult.data[0]);
        } catch (error) {
            console.log("error", error);
            setError(getSchemaValidationErrorsStrings(error) || "Failed to update info");
            props.alert({ type: "error", title: "Edit info", message: "Failed to update info" });
        }
        setLoading(false);
    };

    const renderFooter = () => (
        <div className="flex justify-content-end">
            <Button label="save" className="p-button-text no-focus-effect" onClick={onSave} loading={loading} />
            <Button label="close" className="p-button-text no-focus-effect p-button-secondary" onClick={props.onHide} />
        </div>
    );

    const setValByKey = (key, val) => {
        let new_entity = { ..._entity, [key]: val };
        set_entity(new_entity);
        setError({});
    };

    const idOptions = id.map((elem) => ({ name: elem.name, value: elem.value }));
const candidateIdOptions = candidateId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Employee" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="employee-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="id">Id:</label>
                <Dropdown id="id" value={_entity?.id?._id} optionLabel="name" optionValue="value" options={idOptions} onChange={(e) => setValByKey("id", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["id"]) && (
              <p className="m-0" key="error-id">
                {error["id"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="candidateId">CandidateId:</label>
                <Dropdown id="candidateId" value={_entity?.candidateId?._id} optionLabel="name" optionValue="value" options={candidateIdOptions} onChange={(e) => setValByKey("candidateId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["candidateId"]) && (
              <p className="m-0" key="error-candidateId">
                {error["candidateId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="startDate">StartDate:</label>
                undefined
            </span>
            <small className="p-error">
            {!_.isEmpty(error["startDate"]) && (
              <p className="m-0" key="error-startDate">
                {error["startDate"]}
              </p>
            )}
          </small>
            </div>
                <div className="col-12">&nbsp;</div>
                <small className="p-error">
                {Array.isArray(Object.keys(error))
                ? Object.keys(error).map((e, i) => (
                    <p className="m-0" key={i}>
                        {e}: {error[e]}
                    </p>
                    ))
                : error}
            </small>
            </div>
        </Dialog>
    );
};

const mapState = (state) => {
    const { user } = state.auth;
    return { user };
};
const mapDispatch = (dispatch) => ({
    alert: (data) => dispatch.toast.alert(data),
});

export default connect(mapState, mapDispatch)(EmployeeCreateDialogComponent);
