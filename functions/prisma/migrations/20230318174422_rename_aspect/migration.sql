/*
  Warnings:

  - You are about to drop the `Aspect` table. If the table is not empty, all the data it contains will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- DropTable
DROP TABLE [dbo].[Aspect];

-- CreateTable
CREATE TABLE [dbo].[Criteria] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [description] NVARCHAR(1000) NOT NULL,
    [minValue] INT NOT NULL,
    [maxValue] INT NOT NULL,
    [weight] INT NOT NULL,
    CONSTRAINT [Criteria_pkey] PRIMARY KEY CLUSTERED ([id])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
