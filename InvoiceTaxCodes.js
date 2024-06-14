/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/currentRecord', 'N/log'], function(currentRecord, log) {

    /**
     * Function to be executed when a field's value is changed.
     *
     * @param {Object} context - An object containing context about the event
     * @returns {void}
     * @since 2015.2
     */
    function fieldChanged(context) {
        var invoice = context.currentRecord;
        var fieldId = context.fieldId;

        // Check if the tax code checkbox field is the one that triggered the event
        if (fieldId === 'custbody_custom_tax_code_checkbox') {
            var isChecked = invoice.getValue({fieldId: 'custbody_custom_tax_code_checkbox'});
            log.debug('Checkbox Status', 'Tax code checkbox is ' + (isChecked ? 'checked' : 'not checked'));

            // Proceed only if the checkbox is checked
            if (isChecked) {
                var taxCode = invoice.getValue('custbody_custom_tax_codes_header');
                var lineCount = invoice.getLineCount({sublistId: 'item'});
                log.debug({
                    title: 'Applying Tax Codes',
                    details: 'Tax Code to apply: ' + taxCode + ', Line Count: ' + lineCount
                });

                if (taxCode) {
                    for (var i = 0; i < lineCount; i++) {
                        invoice.selectLine({sublistId: 'item', line: i});
                        invoice.setCurrentSublistValue({
                            sublistId: 'item',
                            fieldId: 'taxcode',
                            value: taxCode
                        });
                        invoice.commitLine({sublistId: 'item', line: i});
                        log.debug({
                            title: 'Tax Code Applied',
                            details: 'Line ' + i + ': Tax code set to ' + taxCode
                        });
                    }
                } else {
                    log.debug({
                        title: 'No Tax Code',
                        details: 'No tax code found to apply to line items.'
                    });
                }
            }
        }
    }

    return {
        fieldChanged: fieldChanged
    };
});
