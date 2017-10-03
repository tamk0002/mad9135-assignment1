let header = React.createClass({
    propTypes: {
    },
    render: function() {
        return(
            React.createElement('div', {className: 'page-header'},
                React.createElement('h1', {}, 'Contact List'))
        );
    }
});

let navMenu = React.createClass({
    render: function() {
        return (
            React.createElement('ul', {className: 'nav-menu'},
                React.createElement('li', {},
                    React.createElement('a', {href: '#'}, 'Contact List')
                ),

                React.createElement('li', {},
                    React.createElement('a', {href: '#newItem'}, 'Create New Contact')
                )
            )
        );
    }
});

let listItem = React.createClass({
    propTypes: {
        'id': React.PropTypes.number,
        'name': React.PropTypes.string.isRequired,
        'phone': React.PropTypes.string.isRequired,
        'email': React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            React.createElement('li', {},
                React.createElement('a', {className: 'nav-item-link', href: '#/item/' + this.props.id},
                    React.createElement('h2', {className: 'list-item-name'}, this.props.name),
                    React.createElement('div', {className: 'list-item-date-of-birth'}, this.props.phone))
            )
        );
    }
});

let listItems = React.createClass({
    propTypes: {
        'items': React.PropTypes.array.isRequired
    },

    render: function() {
        return (
            React.createElement('ul', {className: 'list-item-menu'}, this.props.items.map(i => React.createElement(listItem, i)))
        );
    }
});

let contactsPage = React.createClass({
    propTypes: {
        'items': React.PropTypes.array.isRequired
    },

    render: function() {
        return (
            React.createElement(listItems, {items: this.props.items})
        );
    }
});

let contactDetails = React.createClass({
    propTypes: {
        'name': React.PropTypes.string.isRequired,
        'phone': React.PropTypes.string.isRequired,
        'email': React.PropTypes.string.isRequired
    },

    render: function() {
        return (
            React.createElement('div', {className: 'list-item-menu-details'},
                React.createElement('p', {className: 'list-name-details'},this.props.name),
                React.createElement('p', {}, 'Phone Number: ' + this.props.phone),
                React.createElement('a', {href: 'mailto:' + this.props.email}, 'Email: ' + this.props.email)

            )
        );
    }
});

let createContactForm = React.createClass({
    propTypes: {
        'listItem': React.PropTypes.object.isRequired,
        'onChange': React.PropTypes.func.isRequired,
        'onAdd': React.PropTypes.func.isRequired
    },
    nameInput: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {name: e.target.value}));
    },
    phoneInput: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {phone: e.target.value}));
    },
    emailInput: function(e) {
        this.props.onChange(Object.assign({}, this.props.listItem, {email: e.target.value}));
    },
    onAdd: function() {
        this.props.onAdd(this.props.listItem);
    },
    render: function() {
        return (
            React.createElement('form', {},
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Name',
                    value: this.props.listItem.name,
                    onChange: this.nameInput
                }),
                React.createElement('input', {
                    type: 'text',
                    placeholder: 'Phone Number',
                    value: this.props.listItem.phone,
                    onChange: this.phoneInput
                }),
                React.createElement('input', {
                    placeholder: 'Email Address',
                    value: this.props.listItem.email,
                    onChange: this.emailInput
                }),
                React.createElement('button', {type: 'button', onClick: this.onAdd}, 'Create')
            )
        );
    }
});

let createContactPage = React.createClass({
    propTypes: {
        'listItem': React.PropTypes.object.isRequired,
        'onNewContactChange': React.PropTypes.func.isRequired,
        'onCreateNewContact': React.PropTypes.func.isRequired
    },

    render: function() {
        return (
            React.createElement('div', {},
                React.createElement(createContactForm, {listItem: this.props.listItem, onChange: this.props.onNewContactChange, onAdd: this.props.onCreateNewContact})
            )
        );
    }
});

let state = {};
let setState = function(changes) {
    let component;
    let componentProperties = {};

    Object.assign(state, changes);

    let splitUrl = state.location.replace(/^#\/?|\/$/g, '').split('/');

    switch(splitUrl[0]) {
    case 'item': {
        component = contactDetails;
        componentProperties = state.items.find(i => i.key == splitUrl[1]);
        break;
    }

    case 'newItem': {
        component = createContactPage;
        componentProperties = {
            listItem: state.listItem,
            onNewContactChange: function (item) {
                setState({listItem: item});
            },
            onCreateNewContact: function (item) {
                let itemList = state.items;
                const newKey = itemList.length + 1;
                itemList.push(Object.assign({}, {key: newKey, id: newKey}, item));
                setState({items: itemList, listItem: {name: '', email: '', phone: ''}});
            }
        };
        break;
    }

    default: {
        component = contactsPage;
        componentProperties = {items: state.items};
    }
    }

    let rootElement = React.createElement('div', {},
        React.createElement(header, {}),
        React.createElement(navMenu, {}),
        React.createElement(component, componentProperties)
    );

    ReactDOM.render(rootElement, document.getElementById('react-app'));
};

window.addEventListener('hashchange', ()=>setState({location: location.hash}));

setState({listItem: {name: '', email: '', phone: ''}, location: location.hash, items: items});