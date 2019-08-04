import React from 'react';
import { connect, Formik, Field, Form } from 'formik';
import debounce from 'just-debounce-it';

function AutoSave ({ debounceMs, formik }){
    const [lastSaved, setLastSaved] = React.useState(null);
    const debouncedSubmit = React.useCallback(
        debounce(
            () =>
                formik.submitForm().then(() => setLastSaved(new Date().toISOString())),
            debounceMs
        ),
        [debounceMs, formik.submitForm]
    );

    React.useEffect(() => {
        debouncedSubmit();
    }, [debouncedSubmit, formik.values]);
    
    return null;
}

export default connect(AutoSave);
