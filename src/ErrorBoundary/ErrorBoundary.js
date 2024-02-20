import { Component } from "react";


export default class ErrorBoundary extends Component {
    state = { hasError: false };
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        console.log(error, info);
    }

    render() {
        if (this.state.hasError) {
            return <div>Error, check console</div>;
        }
        return this.props.children;
    }
}
