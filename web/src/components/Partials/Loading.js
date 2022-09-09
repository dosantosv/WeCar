import { Fragment } from "react";

import { Logo as LogoImage, LogoIcon } from "../Images";

function Logo() {
  return <LogoImage className="logo img-fluid" />;
}

function Icon() {
  return <LogoIcon className="icon img-fluid" />;
}

function Text() {
  return <h1>{process.env.REACT_APP_NAME || "Carregando..."}</h1>;
}

export function Loading({ type = "icon" }) {
  const allowedScopes = ["icon", "logo", "text"];

  return (
    <div className="container-fluid container-loading">
      <div className="row h-100 justify-content-center align-items-center loading">
        {allowedScopes.includes(type) ? (
          <Fragment>
            {type === "icon" && <Icon />}
            {type === "logo" && <Logo />}
            {type === "text" && <Text />}
          </Fragment>
        ) : (
          <Icon />
        )}
      </div>
    </div>
  );
}