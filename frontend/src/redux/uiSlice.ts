import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ClusterChooserType } from '../components/cluster/ClusterChooser';

export type FunctionsToOverride = {
  setToken?: (cluster: string, token: string | null) => void;
  getToken?: (cluster: string) => string | undefined;
};

export interface UIState {
  isVersionDialogOpen: boolean;
  clusterChooserButtonComponent?: ClusterChooserType;
  hideAppBar?: boolean;
  isFullWidth?: boolean;
  functionsToOverride: FunctionsToOverride;
}

export const INITIAL_UI_STATE: UIState = {
  isVersionDialogOpen: false,
  hideAppBar: false,
  isFullWidth: false,
  functionsToOverride: {},
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState: INITIAL_UI_STATE,
  reducers: {
    setHideAppBar(state, action: PayloadAction<boolean | undefined>) {
      state.hideAppBar = action.payload;
    },
    setClusterChooserButton(state, action: PayloadAction<ClusterChooserType | undefined>) {
      state.clusterChooserButtonComponent = action.payload;
    },
    setVersionDialogOpen(state, action: PayloadAction<boolean>) {
      state.isVersionDialogOpen = action.payload;
    },
    setFunctionsToOverride(state, action: PayloadAction<FunctionsToOverride>) {
      const functionToOverride = action.payload;
      for (const key in functionToOverride) {
        if (functionToOverride.hasOwnProperty(key)) {
          (state.functionsToOverride as Record<string, any>)[key] =
            functionToOverride[key as keyof FunctionsToOverride];
        }
      }
    },
    setIsFullWidth(state, action: PayloadAction<boolean | undefined>) {
      state.isFullWidth = action.payload;
    },
  },
});
