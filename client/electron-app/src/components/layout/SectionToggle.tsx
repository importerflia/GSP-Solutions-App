
const SectionToggle = ({ children, isVisible }) => {
    const transitionProperties = isVisible ? { maxHeight: 580, opacity: 1 } : {}
    return(
        <div className="section-toggle" style={ transitionProperties }>
            {children}
        </div>
    )
}

export default SectionToggle