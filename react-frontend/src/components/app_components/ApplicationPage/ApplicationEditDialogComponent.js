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
import { Calendar } from 'primereact/calendar';


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

const ApplicationCreateDialogComponent = (props) => {
    const [_entity, set_entity] = useState({});
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const urlParams = useParams();
    const [candidateId, setCandidateId] = useState([])
const [jobOpeningId, setJobOpeningId] = useState([])

    useEffect(() => {
        set_entity(props.entity);
    }, [props.entity, props.show]);

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
 useEffect(() => {
                    //on mount jobOpening
                    client
                        .service("jobOpening")
                        .find({ query: { $limit: 10000, $sort: { createdAt: -1 }, _id : urlParams.singleJobOpeningId } })
                        .then((res) => {
                            setJobOpeningId(res.data.map((e) => { return { name: e[''], value: e._id }}));
                        })
                        .catch((error) => {
                            console.log({ error });
                            props.alert({ title: "JobOpening", type: "error", message: error.message || "Failed get jobOpening" });
                        });
                }, []);

    const onSave = async () => {
        let _data = {
            id: _entity?.id,
candidateId: _entity?.candidateId?._id,
jobOpeningId: _entity?.jobOpeningId?._id,
submittedAt: _entity?.submittedAt,
        };

        setLoading(true);
        try {
            
        await client.service("application").patch(_entity._id, _data);
        const eagerResult = await client
            .service("application")
            .find({ query: { $limit: 10000 ,  _id :  { $in :[_entity._id]}, $populate : [
                {
                    path : "candidateId",
                    service : "candidate",
                    select:[""]},{
                    path : "jobOpeningId",
                    service : "jobOpening",
                    select:[""]}
            ] }});
        props.onHide();
        props.alert({ type: "success", title: "Edit info", message: "Info application updated successfully" });
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

    const candidateIdOptions = candidateId.map((elem) => ({ name: elem.name, value: elem.value }));
const jobOpeningIdOptions = jobOpeningId.map((elem) => ({ name: elem.name, value: elem.value }));

    return (
        <Dialog header="Edit Application" visible={props.show} closable={false} onHide={props.onHide} modal style={{ width: "40vw" }} className="min-w-max scalein animation-ease-in-out animation-duration-1000" footer={renderFooter()} resizable={false}>
            <div className="grid p-fluid overflow-y-auto"
            style={{ maxWidth: "55vw" }} role="application-edit-dialog-component">
                <div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="id">Id:</label>
                <InputText id="id" className="w-full mb-3 p-inputtext-sm" value={_entity?.id} onChange={(e) => setValByKey("id", e.target.value)}  />
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
                <label htmlFor="jobOpeningId">JobOpeningId:</label>
                <Dropdown id="jobOpeningId" value={_entity?.jobOpeningId?._id} optionLabel="name" optionValue="value" options={jobOpeningIdOptions} onChange={(e) => setValByKey("jobOpeningId", {_id : e.value})}  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["jobOpeningId"]) && (
              <p className="m-0" key="error-jobOpeningId">
                {error["jobOpeningId"]}
              </p>
            )}
          </small>
            </div>
<div className="col-12 md:col-6 field">
            <span className="align-items-center">
                <label htmlFor="submittedAt">SubmittedAt:</label>
                <Calendar id="submittedAt" value={_entity?.submittedAt ? new Date(_entity?.submittedAt) : null} onChange={ (e) => setValByKey("submittedAt", e.value)} showTime hourFormat="24"  />
            </span>
            <small className="p-error">
            {!_.isEmpty(error["submittedAt"]) && (
              <p className="m-0" key="error-submittedAt">
                {error["submittedAt"]}
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

export default connect(mapState, mapDispatch)(ApplicationCreateDialogComponent);
