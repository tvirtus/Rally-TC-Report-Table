Ext.define("CustomApp", {
    extend: "Rally.app.App", componentCls: "app",
    launch: function () {
        this._loadData();
    },

    _showTable: function () {

        var table = Ext.create("Ext.grid.Panel", {
            title: "Manual vs. Automated comparison table",
            store: Ext.data.StoreManager.lookup("simpsonsStore"),
            columns: [
                {
                    text: "TYPE \\ METHOD",
                    dataIndex: "type",
                    align: 'left'
                }, {
                    text: "Manual",
                    dataIndex: "manual",
                    align: 'center'
                }, {
                    text: "Automated",
                    dataIndex: "auto",
                    align: 'center',
                    flex: 1
                }, {
                    text: "Total # of TC",
                    dataIndex: "tc",
                    align: 'center'
                }],
            width: 500,
            padding: 15
        });

        this.add(table);
    },


    _createTable: function (objArray) {
        var flag;
        var me = this;

        objArray.forEach(function (obj) {
            if ((obj.auto === '') || (obj.manual === '') || (obj.tc === '')) {
                flag = 'Something';
            }
        });

        if (!flag) {
            Ext.create("Ext.data.Store", {
                storeId: "simpsonsStore",
                fields: ["type", "manual", "auto", "tc"],
                data: {
                    items: objArray
                },
                proxy: {
                    type: "memory",
                    reader: {
                        type: "json",
                        root: "items"
                    }
                }
            });
            me._showTable();
        }
    },

    _loadData: function () {
        var me = this;

        // Method filters
        var manualFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Method',
            operation: '=',
            value: 'Manual'
        });

        var automatedFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Method',
            operation: '=',
            value: 'Automated'
        });

        // Type filters
        var smokeFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Type',
            operation: '=',
            value: 'Smoke Test (+ Regression)'
        });

        var regressionFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Type',
            operation: '=',
            value: 'Regression'
        });

        var performanceFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Type',
            operation: '=',
            value: 'Performance'
        });

        var sanityFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Type',
            operation: '=',
            value: 'Sanity Check'
        });

        var acceptanceFilter = Ext.create('Rally.data.wsapi.Filter', {
            property: 'Type',
            operation: '=',
            value: 'Acceptance'
        });


        var objArray = [
            {
                type: 'Performance',
                manual: '',
                auto: '',
                tc: ''
            },
            {
                type: 'Acceptance',
                manual: '',
                auto: '',
                tc: ''
            },
            {
                type: 'Sanity Check',
                manual: '',
                auto: '',
                tc: ''
            },
            {
                type: 'Smoke Test',
                manual: '',
                auto: '',
                tc: ''
            },
            {
                type: 'Regression',
                manual: '',
                auto: '',
                tc: ''
            },
            {
                type: 'All',
                manual: '',
                auto: '',
                tc: ''
            }
        ];

        [
            manualFilter,
            automatedFilter,
            manualFilter.or(automatedFilter), // the default

            regressionFilter.and(manualFilter),
            regressionFilter.and(automatedFilter),
            regressionFilter,

            acceptanceFilter.and(manualFilter),
            acceptanceFilter.and(automatedFilter),
            acceptanceFilter,

            performanceFilter.and(manualFilter),
            performanceFilter.and(automatedFilter),
            performanceFilter,

            smokeFilter.and(manualFilter),
            smokeFilter.and(automatedFilter),
            smokeFilter,

            sanityFilter.and(manualFilter),
            sanityFilter.and(automatedFilter),
            sanityFilter

        ].forEach(function (filter) {
            Ext.create('Rally.data.wsapi.Store', {
                model: 'Test Case',
                autoLoad: true,
                filters: filter,
                listeners: {
                    load: function (myStore) {
                        // console.log(myStore);
                        // console.log(data);
                        var stringFilter = filter.toString();
                        objArray.forEach(function (obj) {
                            switch (obj.type) {
                                case 'Regression':
                                    switch (stringFilter) {
                                        case '((Type = "Regression") AND (Method = "Manual"))':
                                            obj.manual = myStore.totalCount;
                                            break;
                                        case '((Type = "Regression") AND (Method = "Automated"))':
                                            obj.auto = myStore.totalCount;
                                            break;
                                        case '(Type = "Regression")':
                                            obj.tc = myStore.totalCount;
                                            break;
                                    }
                                    break;
                                case 'Acceptance':
                                    switch (stringFilter) {
                                        case '((Type = "Acceptance") AND (Method = "Manual"))':
                                            obj.manual = myStore.totalCount;
                                            break;
                                        case '((Type = "Acceptance") AND (Method = "Automated"))':
                                            obj.auto = myStore.totalCount;
                                            break;
                                        case '(Type = "Acceptance")':
                                            obj.tc = myStore.totalCount;
                                            break;
                                    }
                                    break;
                                case 'Performance':
                                    switch (stringFilter) {
                                        case '((Type = "Performance") AND (Method = "Manual"))':
                                            obj.manual = myStore.totalCount;
                                            break;
                                        case '((Type = "Performance") AND (Method = "Automated"))':
                                            obj.auto = myStore.totalCount;
                                            break;
                                        case '(Type = "Performance")':
                                            obj.tc = myStore.totalCount;
                                            break;
                                    }
                                    break;
                                case 'Sanity Check':
                                    switch (stringFilter) {
                                        case '((Type = "Sanity Check") AND (Method = "Manual"))':
                                            obj.manual = myStore.totalCount;
                                            break;
                                        case '((Type = "Sanity Check") AND (Method = "Automated"))':
                                            obj.auto = myStore.totalCount;
                                            break;
                                        case '(Type = "Sanity Check")':
                                            obj.tc = myStore.totalCount;
                                            break;
                                    }
                                    break;
                                case 'Smoke Test':
                                    switch (stringFilter) {
                                        case '((Type = "Smoke Test (+ Regression)") AND (Method = "Manual"))':
                                            obj.manual = myStore.totalCount;
                                            break;
                                        case '((Type = "Smoke Test (+ Regression)") AND (Method = "Automated"))':
                                            obj.auto = myStore.totalCount;
                                            break;
                                        case '(Type = "Smoke Test (+ Regression)")':
                                            obj.tc = myStore.totalCount;
                                            break;
                                    }
                                    break;
                                case 'All':
                                    switch (stringFilter) {
                                        case '(Method = "Manual")':
                                            obj.manual = myStore.totalCount;
                                            break;
                                        case '(Method = "Automated")':
                                            obj.auto = myStore.totalCount;
                                            break;
                                        case '((Method = "Manual") OR (Method = "Automated"))':
                                            obj.tc = myStore.totalCount;
                                            break;
                                    }
                                    break;
                                default:
                                    console.log('Default');
                            }
                        });

                        me._createTable(objArray);
                    },
                    scope: this
                },
                fetch: ['Type', 'Method']
            });
        });
    }
});