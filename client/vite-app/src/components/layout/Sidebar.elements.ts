import styled from 'styled-components'
import { Link } from 'react-router-dom'

export const Menu = styled.ul`
    display: none;

    @media screen and (max-width: 880px){
        display: flex;
        position: absolute;
        top: 60px;
        left: ${({ open }) => open ? "0" : "-100%"};
        width: 100%;
        height: 92vh;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        transition: 0.5s all ease;
        list-style: none;
        background-color: var(--azul);
        margin: 0;
        padding: 0;
        z-index: 1;
    }
`

export const MenuItem = styled.li`
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: auto;
`

export const MenuItemLink = styled(Link)`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 0.5rem 2.5rem;
    font-family: var(--fontTexto);
    color: var(--grisClaro);
    font-size: 2rem;
    cursor: pointer;
    transition: 0.5s all ease;

    &:hover{
        color: #fff;
        background-color: var(--amarillo);
        transition: 0.5 all ease;

        div{
            svg{
                fill: var(--azul)
            }
        }
    }

    div{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        svg{
            fill: var(--amarillo);
            margin-right: 0.5rem;
        }
    }
`

export const MobileIcon = styled.div`
    display: none;

    @media (max-width: 880px) {
        display: flex;
        align-items: center;
        cursor: pointer;

        svg {
            fill: var(--grisClaro);
            margin-right: 0.5rem;
        }
    }
`

export const MenuLeftItemLink = styled(Link)`
    display: flex;
    justify-content: left;
    align-items: left;
    width: 100%;
    height: 100%;
    font-family: var(--fontTexto);
    color: var(--grisClaro);
    font-size: 2rem;
    cursor: pointer;

    div{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: left;
        align-items: left;

        svg{
            font-size: 2.5rem;
            margin-right: 1.5rem;
        }
    }
`

export const ToggleIcon = styled.div`
    display: flex;
    align-items: center;
    justify-self: start;
    cursor: pointer;

    svg {
        fill: var(--azul);
        margin-right: 0.5rem;
    }
`

export const MenuToggle = styled.div`
    display: ${({ open }) => open ? 'flex' : 'none'};
`